import { redirect } from "next/navigation";

/** Tanpa nomor invoice tidak ada yang bisa dibayar — arahkan ke katalog. */
export default function PaymentIndexPage() {
  redirect("/#kategori");
}
