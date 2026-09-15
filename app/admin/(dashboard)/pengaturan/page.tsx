import { saveContentPatch } from "@/app/admin/actions";
import { ObjectEditor, RepeatableEditor, type FieldDef } from "@/components/admin/fields";
import { ResetContentButton } from "@/components/admin/ResetContentButton";
import { getContentSnapshot } from "@/lib/content/store";
import type { GameCategory, LinkItem, NavItem, SocialLink } from "@/types";

export const metadata = { title: "Identitas & Navigasi", robots: { index: false, follow: false } };

const BRAND_FIELDS: FieldDef[] = [
  { name: "name", label: "Nama brand", type: "text", help: "Dua huruf terakhir otomatis diberi warna aksen di logo." },
  { name: "legalName", label: "Nama legal (footer)", type: "text" },
  { name: "tagline", label: "Tagline", type: "text", wide: true },
  { name: "description", label: "Deskripsi situs", type: "textarea", wide: true, help: "Dipakai untuk meta description dan JSON-LD." },
  { name: "slogan", label: "Slogan footer", type: "text" },
  { name: "footerNote", label: "Catatan kaki", type: "text" },
  { name: "themeColor", label: "Warna tema", type: "text", help: "Hex, contoh #1d4ed8. Dipakai browser di mobile." },
  { name: "ogImage", label: "Gambar kartu sosial", type: "text", help: "Ideal 1200x630, format JPG atau PNG." },
  { name: "twitterHandle", label: "Akun X/Twitter", type: "text", help: "Dengan @, contoh @juegova." },
];

const CONTACT_FIELDS: FieldDef[] = [
  { name: "whatsapp", label: "Nomor WhatsApp CS", type: "text", help: "Format internasional tanpa +, contoh 6281234567890." },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Telepon", type: "text" },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { name: "label", label: "Platform", type: "text" },
  { name: "short", label: "Huruf di footer", type: "text" },
  { name: "url", label: "URL profil", type: "text", help: "Kosongkan kalau belum ada — ikonnya jadi tidak bisa diklik." },
];

const HEADING_FIELDS: FieldDef[] = [
  { name: "title", label: "Judul section", type: "text", wide: true },
  { name: "subtitle", label: "Subjudul", type: "text", wide: true },
];

const CATEGORY_FIELDS: FieldDef[] = [
  { name: "label", label: "Nama kategori", type: "text" },
  { name: "id", label: "Slug kategori", type: "text", help: "Dipakai di data game, contoh battle-royale." },
];

const NAV_FIELDS: FieldDef[] = [
  { name: "label", label: "Teks menu", type: "text" },
  { name: "href", label: "Link", type: "text" },
  { name: "id", label: "ID unik", type: "text", help: "Dipakai untuk menandai menu aktif, contoh beranda." },
];

const FOOTER_LINK_FIELDS: FieldDef[] = [
  { name: "label", label: "Teks", type: "text" },
  { name: "href", label: "Link", type: "text" },
];

const EMPTY_SOCIAL: SocialLink = { short: "", label: "", url: "" };
const EMPTY_CATEGORY: GameCategory = { id: "", label: "" };
const EMPTY_NAV: NavItem = { id: "", label: "", href: "" };
const EMPTY_LINK: LinkItem = { label: "", href: "" };

export default async function AdminSettingsPage() {
  const { content } = await getContentSnapshot();

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Identitas & Navigasi</h1>
        <p className="mt-1 text-xs text-slate-500">
          Nama brand, kontak, menu, kategori, dan judul section di beranda.
        </p>
      </header>

      <ObjectEditor
        title="Identitas brand"
        description="Perubahan nama langsung ikut ke logo, judul halaman, dan metadata SEO."
        fields={BRAND_FIELDS}
        initial={content.settings as unknown as Record<string, unknown>}
        action={saveContentPatch}
        patchPath="settings"
      />

      <ObjectEditor
        title="Kontak"
        description="Email dan telepon otomatis masuk ke JSON-LD Organization."
        fields={CONTACT_FIELDS}
        initial={content.settings.contact as unknown as Record<string, unknown>}
        action={saveContentPatch}
        patchPath="settings.contact"
      />

      <RepeatableEditor<SocialLink>
        title="Media sosial"
        fields={SOCIAL_FIELDS}
        initialItems={content.settings.socials}
        emptyItem={EMPTY_SOCIAL}
        action={saveContentPatch}
        patchPath="settings.socials"
        titleField="label"
        titlePrefix="Sosmed"
        addLabel="Tambah sosmed"
      />

      <ObjectEditor
        title="Judul section katalog"
        fields={HEADING_FIELDS}
        initial={content.sections.catalog as unknown as Record<string, unknown>}
        action={saveContentPatch}
        patchPath="sections.catalog"
      />

      <ObjectEditor
        title="Judul section keunggulan"
        fields={HEADING_FIELDS}
        initial={content.sections.features as unknown as Record<string, unknown>}
        action={saveContentPatch}
        patchPath="sections.features"
      />

      <RepeatableEditor<GameCategory>
        title="Kategori game"
        description="Chip filter di beranda. Kategori tanpa game otomatis tidak ditampilkan."
        fields={CATEGORY_FIELDS}
        initialItems={content.categories}
        emptyItem={EMPTY_CATEGORY}
        action={saveContentPatch}
        patchPath="categories"
        titleField="label"
        titlePrefix="Kategori"
        addLabel="Tambah kategori"
      />

      <RepeatableEditor<NavItem>
        title="Menu header"
        fields={NAV_FIELDS}
        initialItems={content.navigation.header}
        emptyItem={EMPTY_NAV}
        action={saveContentPatch}
        patchPath="navigation.header"
        titleField="label"
        titlePrefix="Menu"
        addLabel="Tambah menu"
      />

      <RepeatableEditor<LinkItem>
        title="Menu footer"
        fields={FOOTER_LINK_FIELDS}
        initialItems={content.navigation.footerMenu}
        emptyItem={EMPTY_LINK}
        action={saveContentPatch}
        patchPath="navigation.footerMenu"
        titleField="label"
        titlePrefix="Link"
        addLabel="Tambah link"
      />

      <RepeatableEditor<LinkItem>
        title="Tentang kami (footer)"
        fields={FOOTER_LINK_FIELDS}
        initialItems={content.navigation.footerAbout}
        emptyItem={EMPTY_LINK}
        action={saveContentPatch}
        patchPath="navigation.footerAbout"
        titleField="label"
        titlePrefix="Link"
        addLabel="Tambah link"
      />

      <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
        <h2 className="text-sm font-extrabold text-red-700">Kembalikan ke isi awal</h2>
        <p className="mt-1 mb-3 text-xs text-red-600">
          Menghapus semua perubahan tersimpan dan memakai kembali isi bawaan di folder{" "}
          <code className="rounded bg-white px-1">data/</code>.
        </p>
        <ResetContentButton />
      </section>
    </>
  );
}
