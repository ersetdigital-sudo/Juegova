import { saveContentPatch } from "@/app/admin/actions";
import {
  ObjectEditor,
  RepeatableEditor,
  StringListEditor,
  type FieldDef,
} from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { Badge, Feature, TrustItem } from "@/types";

export const metadata = { title: "Keunggulan", robots: { index: false, follow: false } };

/** Harus sama dengan ikon yang tersedia di components/ui/Icon.tsx. */
const ICON_OPTIONS = [
  { value: "bolt", label: "Petir — proses cepat" },
  { value: "shield", label: "Perisai — aman / garansi" },
  { value: "crown", label: "Mahkota — harga terbaik" },
  { value: "clock", label: "Jam — layanan 24 jam" },
  { value: "chat", label: "Chat — bantuan CS" },
  { value: "lock", label: "Gembok — pembayaran aman" },
  { value: "info", label: "Info" },
  { value: "check", label: "Centang" },
  { value: "arrow-right", label: "Panah kanan" },
];

const FEATURE_FIELDS: FieldDef[] = [
  { name: "title", label: "Judul", type: "text" },
  { name: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
  {
    name: "variant",
    label: "Warna kartu",
    type: "select",
    options: [
      { value: "slate", label: "Abu-abu" },
      { value: "blue", label: "Biru" },
      { value: "amber", label: "Oranye" },
    ],
  },
  { name: "description", label: "Deskripsi", type: "textarea", wide: true },
];

const BADGE_FIELDS: FieldDef[] = [
  { name: "label", label: "Teks badge", type: "text" },
  { name: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
];

const TRUST_FIELDS: FieldDef[] = [
  { name: "title", label: "Judul", type: "text" },
  { name: "icon", label: "Ikon", type: "select", options: ICON_OPTIONS },
  { name: "description", label: "Kalimat lanjutan", type: "textarea", wide: true },
];

const EMPTY_FEATURE: Feature = { icon: "bolt", title: "", description: "", variant: "slate" };
const EMPTY_BADGE: Badge = { icon: "bolt", label: "" };
const EMPTY_TRUST: TrustItem = { icon: "shield", title: "", description: "" };

export default async function AdminHighlightsPage() {
  const { content } = await getContentSnapshot();

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Keunggulan</h1>
        <p className="mt-1 text-xs text-slate-500">
          Kartu “Kenapa Pilih …”, badge di banner game, dan poin jaminan di halaman game serta
          pembayaran.
        </p>
      </header>

      <RepeatableEditor<Feature>
        title="Kartu keunggulan di beranda"
        fields={FEATURE_FIELDS}
        initialItems={content.features}
        emptyItem={EMPTY_FEATURE}
        action={saveContentPatch}
        patchPath="features"
        titleField="title"
        titlePrefix="Keunggulan"
        addLabel="Tambah kartu"
      />

      <RepeatableEditor<Badge>
        title="Badge di banner game"
        description="Pil kecil di bawah nama game, contoh “Proses Instan”."
        fields={BADGE_FIELDS}
        initialItems={content.badges}
        emptyItem={EMPTY_BADGE}
        action={saveContentPatch}
        patchPath="badges"
        titleField="label"
        titlePrefix="Badge"
        addLabel="Tambah badge"
      />

      <RepeatableEditor<TrustItem>
        title="Poin jaminan di halaman game"
        fields={TRUST_FIELDS}
        initialItems={content.trustItems}
        emptyItem={EMPTY_TRUST}
        action={saveContentPatch}
        patchPath="trustItems"
        titleField="title"
        titlePrefix="Poin"
        addLabel="Tambah poin"
      />

      <RepeatableEditor<TrustItem>
        title="Poin jaminan di halaman pembayaran"
        fields={TRUST_FIELDS}
        initialItems={content.paymentTrustItems}
        emptyItem={EMPTY_TRUST}
        action={saveContentPatch}
        patchPath="paymentTrustItems"
        titleField="title"
        titlePrefix="Poin"
        addLabel="Tambah poin"
      />

      <StringListEditor
        title="Langkah “Cara Top Up”"
        description="Muncul di bagian Tentang Game Ini pada setiap halaman game."
        initialItems={content.topUpSteps}
        action={saveContentPatch}
        patchPath="topUpSteps"
        placeholder="Contoh: Pilih nominal yang ingin dibeli."
        addLabel="Tambah langkah"
      />
    </>
  );
}
