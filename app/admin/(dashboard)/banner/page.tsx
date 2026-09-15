import { saveContentPatch } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { getContentSnapshot } from "@/lib/content/store";
import type { HeroSlide } from "@/types";

export const metadata = { title: "Banner Hero", robots: { index: false, follow: false } };

const SLIDE_FIELDS: FieldDef[] = [
  { name: "image", label: "Gambar (path atau URL)", type: "text", placeholder: "/images/hero-baru.webp", wide: true },
  { name: "imageAlt", label: "Alt text", type: "text", wide: true, help: "Wajib deskriptif untuk SEO dan pembaca layar." },
  { name: "href", label: "Link tujuan", type: "text", placeholder: "/game/mobile-legends" },
  { name: "id", label: "ID unik", type: "text", help: "Boleh apa saja, tapi jangan sama dengan slide lain." },
  { name: "width", label: "Lebar asli (px)", type: "number" },
  { name: "height", label: "Tinggi asli (px)", type: "number" },
];

const EMPTY_SLIDE: HeroSlide = {
  id: "slide-baru",
  href: "/#kategori",
  image: "/images/og-cover.jpg",
  imageAlt: "",
  width: 2172,
  height: 724,
};

export default async function AdminBannerPage() {
  const { content } = await getContentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Banner Hero"
        description="Slider di paling atas beranda. Urutannya sesuai daftar ini, dan berganti otomatis setiap 4 detik."
      />

      <RepeatableEditor<HeroSlide>
        title="Slide banner"
        description="Isi ukuran asli gambar supaya tidak ada pergeseran layout saat halaman dimuat."
        fields={SLIDE_FIELDS}
        initialItems={content.heroSlides}
        emptyItem={EMPTY_SLIDE}
        action={saveContentPatch}
        patchPath="heroSlides"
        titleField="imageAlt"
        titlePrefix="Slide"
        addLabel="Tambah slide"
      />
    </>
  );
}
