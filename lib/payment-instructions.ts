import {
  EWALLET_NAMES,
  RETAIL_CODE_LABEL,
  RETAIL_PAYMENT_NAME,
  VIRTUAL_ACCOUNT_MAP,
} from "@/data/payments";
import { formatRupiah } from "@/lib/format";

export interface PaymentInstruction {
  /** "qr" = tampilkan QR untuk di-scan, "code" = tampilkan nomor VA / kode retail. */
  mode: "qr" | "code";
  label: string;
  code: string;
  steps: string[];
}

const verifiedStep = "Item otomatis masuk setelah pembayaran terverifikasi.";

export function buildPaymentInstruction(paymentName: string, total: number): PaymentInstruction {
  const totalLabel = formatRupiah(total);
  const virtualAccount = VIRTUAL_ACCOUNT_MAP[paymentName];

  if (virtualAccount) {
    return {
      mode: "code",
      label: virtualAccount.label,
      code: `${virtualAccount.prefix} ${String(Math.floor(1e9 + Math.random() * 9e9)).slice(0, 10)}`,
      steps: [
        "Buka aplikasi m-banking atau ATM kamu.",
        "Pilih menu Transfer → Virtual Account.",
        "Masukkan nomor VA di atas, lalu cek nama penerima: JUEGOVA.",
        `Masukkan nominal ${totalLabel} dan konfirmasi.`,
        verifiedStep,
      ],
    };
  }

  if (paymentName === RETAIL_PAYMENT_NAME) {
    return {
      mode: "code",
      label: RETAIL_CODE_LABEL,
      code: String(Math.floor(1e11 + Math.random() * 9e11)).slice(0, 12),
      steps: [
        "Datang ke gerai Alfamart terdekat.",
        "Sebutkan ke kasir: bayar Juegova.",
        "Tunjukkan kode pembayaran di atas.",
        `Bayar sebesar ${totalLabel} dan simpan struknya.`,
        verifiedStep,
      ],
    };
  }

  if (EWALLET_NAMES.includes(paymentName)) {
    return {
      mode: "qr",
      label: "",
      code: "",
      steps: [
        `Buka aplikasi ${paymentName} di HP kamu.`,
        "Pilih menu Scan / Bayar dan scan QR di atas.",
        `Pastikan nama penerima JUEGOVA dan nominal ${totalLabel}.`,
        "Konfirmasi pembayaran dengan PIN kamu.",
        verifiedStep,
      ],
    };
  }

  return {
    mode: "qr",
    label: "",
    code: "",
    steps: [
      "Buka aplikasi e-wallet atau m-banking apa pun yang mendukung QRIS.",
      "Pilih menu Scan QRIS dan arahkan ke QR di atas.",
      `Pastikan nama penerima JUEGOVA dan nominal ${totalLabel}.`,
      "Konfirmasi pembayaran dengan PIN kamu.",
      verifiedStep,
    ],
  };
}
