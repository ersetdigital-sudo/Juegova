import { formatRupiah } from "@/lib/format";
import type { PaymentMethod } from "@/types";

export interface PaymentInstruction {
  /** "qr" = tampilkan gambar QR, "code" = tampilkan nomor tujuan. */
  mode: "qr" | "code";
  label: string;
  code: string;
  accountName: string;
  /** Gambar QRIS hasil upload admin. Kosong berarti admin belum mengunggahnya. */
  qrImage: string;
  steps: string[];
}

const verifiedStep = "Item otomatis masuk setelah pembayaran terverifikasi.";

function qrisSteps(totalLabel: string, methodName: string): string[] {
  const opener =
    methodName.toUpperCase() === "QRIS"
      ? "Buka aplikasi e-wallet atau m-banking apa pun yang mendukung QRIS."
      : `Buka aplikasi ${methodName} di HP kamu.`;

  return [
    opener,
    "Pilih menu Scan / Bayar, lalu arahkan kamera ke QR di atas.",
    `Pastikan nama penerima benar dan nominalnya ${totalLabel}.`,
    "Konfirmasi pembayaran dengan PIN kamu.",
    verifiedStep,
  ];
}

function transferSteps(totalLabel: string, method: PaymentMethod): string[] {
  const isRetail = /alfamart|indomaret/i.test(method.name);

  if (isRetail) {
    return [
      `Datang ke gerai ${method.name} terdekat.`,
      `Sebutkan ke kasir: bayar ${method.accountLabel.toLowerCase()}.`,
      "Tunjukkan kode pembayaran di atas.",
      `Bayar sebesar ${totalLabel} dan simpan struknya.`,
      verifiedStep,
    ];
  }

  const recipient = method.accountName ? `, lalu cek nama penerima: ${method.accountName}` : "";
  return [
    "Buka aplikasi m-banking atau ATM kamu.",
    `Pilih menu transfer, lalu masukkan ${method.accountLabel.toLowerCase()} di atas${recipient}.`,
    `Masukkan nominal ${totalLabel} dan konfirmasi.`,
    "Simpan bukti transfer untuk jaga-jaga.",
    verifiedStep,
  ];
}

/**
 * Instruksi pembayaran dari data metode yang diatur admin.
 *
 * `fallbackName` dipakai kalau metodenya sudah dihapus, tapi pesanannya masih ada —
 * pembeli tetap dapat langkah umum, bukan halaman yang rusak.
 */
export function buildPaymentInstruction(
  method: PaymentMethod | null,
  fallbackName: string,
  total: number,
): PaymentInstruction {
  const totalLabel = formatRupiah(total);

  if (!method) {
    return {
      mode: "qr",
      label: "",
      code: "",
      accountName: "",
      qrImage: "",
      steps: [
        `Metode ${fallbackName} sudah tidak tersedia.`,
        "Hubungi CS lewat halaman Bantuan supaya pesananmu bisa dibantu.",
      ],
    };
  }

  const isQr = method.type === "qris";
  const custom = method.instructions.filter((step) => step.trim().length > 0);

  return {
    mode: isQr ? "qr" : "code",
    label: method.accountLabel,
    code: method.accountNumber,
    accountName: method.accountName,
    qrImage: method.qrImage,
    steps: custom.length > 0 ? custom : isQr ? qrisSteps(totalLabel, method.name) : transferSteps(totalLabel, method),
  };
}
