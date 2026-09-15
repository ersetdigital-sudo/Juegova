import localFont from "next/font/local";

/**
 * Font di-copy ke public/fonts/ supaya satu tempat dengan asset lain.
 * Hanya weight yang benar-benar dipakai di markup yang didaftarkan — tidak ada
 * utilitas italic/light/thin di HTML aslinya, jadi file itu tidak ikut dimuat.
 */
export const jakarta = localFont({
  src: [
    { path: "../public/fonts/plusjakartasans-regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/plusjakartasans-medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/plusjakartasans-semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/plusjakartasans-bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/plusjakartasans-extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

export const outfit = localFont({
  src: [
    { path: "../public/fonts/outfit-wght--regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/outfit-wght--medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/outfit-wght--semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/outfit-wght--bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/outfit-wght--extrabold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/outfit-wght--black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-outfit",
  display: "swap",
});

export const caveat = localFont({
  src: [
    { path: "../public/fonts/caveat-wght--regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/caveat-wght--medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/caveat-wght--semibold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/caveat-wght--bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-caveat",
  display: "swap",
});

export const fontVariables = [jakarta.variable, outfit.variable, caveat.variable].join(" ");
