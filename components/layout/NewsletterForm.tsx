"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          // TODO: sambungkan ke endpoint newsletter asli. HTML asli hanya menampilkan alert.
          event.currentTarget.reset();
          setSubscribed(true);
        }}
      >
        <input
          type="email"
          required
          placeholder="Masukkan email kamu"
          aria-label="Alamat email untuk newsletter"
          className="flex-1 min-w-0 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full grad text-white text-xs font-bold"
        >
          Subscribe
        </button>
      </form>
      {subscribed ? (
        <p role="status" className="mt-2 text-[11px] font-semibold text-blue-600">
          Terima kasih sudah berlangganan!
        </p>
      ) : null}
    </>
  );
}
