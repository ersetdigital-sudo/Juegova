"use client";

import { useState, useTransition } from "react";
import { cx } from "@/lib/cx";
import type { ActionResult } from "@/types";

export type { ActionResult };

export interface FieldDef {
  /** Mendukung dot-path untuk objek bersarang, mis. "contact.email". */
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "toggle";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  /** Field yang butuh lebar penuh, mis. textarea atau deskripsi panjang. */
  wide?: boolean;
}

type AnyRecord = Record<string, unknown>;

export function getPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (acc as AnyRecord | undefined)?.[key], source);
}

function setPath(source: AnyRecord, path: string, value: unknown): AnyRecord {
  const [head, ...rest] = path.split(".");
  if (!head) return source;
  if (rest.length === 0) return { ...source, [head]: value };
  return {
    ...source,
    [head]: setPath((source[head] as AnyRecord | undefined) ?? {}, rest.join("."), value),
  };
}

/** Membungkus nilai jadi patch bersarang, mis. ("navigation.header", data) -> { navigation: { header: data } }. */
function buildPatch(path: string, value: unknown): AnyRecord {
  const [head, ...rest] = path.split(".");
  if (!head) return {};
  return rest.length === 0 ? { [head]: value } : { [head]: buildPatch(rest.join("."), value) };
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.type === "toggle") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        {field.help ?? "Aktif"}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className={inputClass}
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        placeholder={field.placeholder}
        className={inputClass}
      />
    );
  }

  return (
    <input
      type="text"
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      className={inputClass}
    />
  );
}

export function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: AnyRecord;
  onChange: (name: string, next: unknown) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={cx("space-y-1", (field.wide || field.type === "textarea") && "sm:col-span-2")}>
          <label className="block text-xs font-bold text-slate-600">{field.label}</label>
          <FieldInput
            field={field}
            value={getPath(values, field.name)}
            onChange={(next) => onChange(field.name, next)}
          />
          {field.help && field.type !== "toggle" ? (
            <p className="text-[11px] text-slate-400">{field.help}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <header className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-extrabold text-slate-800">{title}</h2>
        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      </header>
      <div className="px-5 py-5">{children}</div>
      <footer className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
        {footer}
      </footer>
    </section>
  );
}

export function SaveButton({ pending, label = "Simpan" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full grad px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

export function StatusText({ status }: { status: ActionResult | null }) {
  if (!status) return null;
  return (
    <span
      role="status"
      className={cx("text-xs font-semibold", status.ok ? "text-emerald-600" : "text-red-600")}
    >
      {status.message}
    </span>
  );
}

/** Editor untuk daftar teks sederhana (mis. langkah "Cara Top Up"). */
export function StringListEditor({
  title,
  description,
  initialItems,
  action,
  patchPath,
  placeholder,
  addLabel = "Tambah baris",
  submitLabel,
}: {
  title: string;
  description?: string;
  initialItems: string[];
  action: (patch: AnyRecord) => Promise<ActionResult>;
  patchPath: string;
  placeholder?: string;
  addLabel?: string;
  submitLabel?: string;
}) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved ?? "");
    setItems(copy);
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(buildPatch(patchPath, items))));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
          </>
        }
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 text-xs font-bold text-slate-400">{index + 1}</span>
              <input
                value={item}
                onChange={(event) => {
                  setItems((current) =>
                    current.map((entry, position) =>
                      position === index ? event.target.value : entry,
                    ),
                  );
                  setStatus(null);
                }}
                placeholder={placeholder}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Naikkan"
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Turunkan"
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  setItems((current) => current.filter((_, position) => position !== index));
                  setStatus(null);
                }}
                aria-label="Hapus"
                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-bold text-red-600"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current, ""]);
            setStatus(null);
          }}
          className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          + {addLabel}
        </button>
      </Panel>
    </form>
  );
}

/** Form untuk satu objek datar (mendukung dot-path untuk properti bersarang). */
export function ObjectEditor({
  title,
  description,
  fields,
  initial,
  action,
  patchPath,
  submitLabel,
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: object;
  /** Server action dari app/admin/actions.ts. */
  action: (patch: AnyRecord) => Promise<ActionResult>;
  /** Di mana nilai ini disimpan di dokumen konten, mis. "settings" atau "settings.contact". */
  patchPath: string;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<AnyRecord>(initial as AnyRecord);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const handleChange = (name: string, next: unknown) => {
    setValues((current) => setPath(current, name, next));
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(buildPatch(patchPath, values))));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
          </>
        }
      >
        <FieldGrid fields={fields} values={values} onChange={handleChange} />
      </Panel>
    </form>
  );
}

/** Editor daftar: tambah, hapus, geser naik/turun, lalu simpan sekaligus. */
export function RepeatableEditor<T extends object>({
  title,
  description,
  fields,
  initialItems,
  emptyItem,
  action,
  patchPath,
  titleField,
  titlePrefix = "Item",
  addLabel = "Tambah item",
  submitLabel,
  emptyLabel = "Belum ada item.",
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  initialItems: T[];
  /** Template untuk item baru. Dikirim sebagai data karena fungsi tidak bisa lewat batas server/client. */
  emptyItem: T;
  action: (patch: AnyRecord) => Promise<ActionResult>;
  patchPath: string;
  /** Nama field yang dipakai sebagai judul tiap baris. */
  titleField?: string;
  titlePrefix?: string;
  addLabel?: string;
  submitLabel?: string;
  emptyLabel?: string;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const labelFor = (item: T, index: number) => {
    const value = titleField ? getPath(item, titleField) : null;
    const text = typeof value === "string" && value.trim() ? value : null;
    return `${titlePrefix} ${index + 1}${text ? ` — ${text}` : ""}`;
  };

  const updateItem = (index: number, name: string, next: unknown) => {
    setItems((current) =>
      current.map((item, position) =>
        position === index
          ? (setPath(item as unknown as AnyRecord, name, next) as T)
          : item,
      ),
    );
    setStatus(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved as T);
      return copy;
    });
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(buildPatch(patchPath, items))));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
            <span className="ml-auto text-[11px] text-slate-400">{items.length} item</span>
          </>
        }
      >
        {items.length === 0 ? (
          <p className="text-xs text-slate-400">{emptyLabel}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700">
                    {labelFor(item, index)}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Naikkan"
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Turunkan"
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItems((current) => current.filter((_, position) => position !== index));
                        setStatus(null);
                      }}
                      aria-label="Hapus"
                      className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-bold text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <FieldGrid
                  fields={fields}
                  values={item as unknown as AnyRecord}
                  onChange={(name, next) => updateItem(index, name, next)}
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current, structuredClone(emptyItem)]);
            setStatus(null);
          }}
          className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          + {addLabel}
        </button>
      </Panel>
    </form>
  );
}
