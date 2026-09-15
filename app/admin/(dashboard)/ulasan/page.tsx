import { saveContentPatch } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ObjectEditor, RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { GameReview, Testimonial } from "@/types";

export const metadata = { title: "Ulasan", robots: { index: false, follow: false } };

const ACCENT_OPTIONS = [
  { value: "grad", label: "Biru gradasi" },
  { value: "blue", label: "Biru muda" },
  { value: "amber", label: "Oranye" },
];

const REVIEW_FIELDS: FieldDef[] = [
  { name: "name", label: "Nama", type: "text" },
  { name: "initials", label: "Inisial avatar", type: "text", help: "Maksimal 2 huruf, contoh RM." },
  { name: "accent", label: "Warna avatar", type: "select", options: ACCENT_OPTIONS },
  { name: "quote", label: "Isi ulasan", type: "textarea", wide: true },
];

const EMPTY_TESTIMONIAL: Testimonial = { name: "", initials: "", quote: "", accent: "grad" };
const EMPTY_REVIEW: GameReview = { name: "", initials: "", quote: "", accent: "blue" };

const RATING_FIELDS: FieldDef[] = [
  { name: "value", label: "Nilai rating", type: "number", help: "Skala 1-5, contoh 4.9" },
  { name: "count", label: "Jumlah ulasan", type: "number", help: "Contoh 12480" },
];

const HEADING_FIELDS: FieldDef[] = [
  { name: "title", label: "Judul section", type: "text", wide: true },
  { name: "subtitle", label: "Subjudul", type: "text", wide: true },
  { name: "href", label: "Link \"Lihat Semua\"", type: "text", help: "Isi \"#\" kalau belum ada halaman tujuannya." },
];

export default async function AdminReviewsPage() {
  const { content } = await getContentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Ulasan"
        description="Rating yang tampil di halaman game, ulasan di beranda, dan ulasan di setiap halaman game."
      />

      <ObjectEditor
        title="Rating keseluruhan"
        description="Dipakai di halaman game dan schema Product (JSON-LD)."
        fields={RATING_FIELDS}
        initial={{ value: content.rating.value, count: content.rating.count }}
        action={saveContentPatch}
        patchPath="rating"
      />

      <ObjectEditor
        title="Judul bagian ulasan"
        fields={HEADING_FIELDS}
        initial={content.sections.testimonials}
        action={saveContentPatch}
        patchPath="sections.testimonials"
      />

      <RepeatableEditor<Testimonial>
        title="Ulasan di beranda"
        description="Tampil di bagian “Apa Kata Mereka?”."
        fields={REVIEW_FIELDS}
        initialItems={content.testimonials}
        emptyItem={EMPTY_TESTIMONIAL}
        action={saveContentPatch}
        patchPath="testimonials"
        titleField="name"
        titlePrefix="Ulasan"
        addLabel="Tambah ulasan"
      />

      <RepeatableEditor<GameReview>
        title="Ulasan di halaman game"
        description="Ulasan yang sama tampil di semua halaman game."
        fields={REVIEW_FIELDS}
        initialItems={content.gameReviews}
        emptyItem={EMPTY_REVIEW}
        action={saveContentPatch}
        patchPath="gameReviews"
        titleField="name"
        titlePrefix="Ulasan"
        addLabel="Tambah ulasan"
      />
    </>
  );
}
