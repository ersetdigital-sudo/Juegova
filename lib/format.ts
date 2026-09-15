/** Rp 1.500 — sama seperti `n.toLocaleString("id-ID")` di HTML asli. */
export const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export const formatRupiahRange = (min: number) => `Mulai dari ${formatRupiah(min)}`;

/** Tanggal & waktu dipatok ke zona WIB supaya hasilnya konsisten server & client. */
export const formatDateTime = (date: Date) =>
  date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });
