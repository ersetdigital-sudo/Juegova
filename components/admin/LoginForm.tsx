"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="password" className="block text-xs font-bold text-slate-600">
          Password admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {state && !state.ok ? (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full grad px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
