<div align="center">

# Juegova

**Top up game, lebih seru setiap hari.**

A production-ready game top-up storefront — 6 game catalogs, a 3-step checkout flow, and a fully static, SEO-optimised Next.js 15 App Router build.

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-E91E63?logo=framer&logoColor=white)](https://motion.dev)
[![App Router](https://img.shields.io/badge/App_Router-SSG_%2B_dynamic-1d4ed8)](#routing--rendering)

![Juegova home page](docs/home-hero.jpg)

</div>

---

## Overview

Juegova is a storefront where gamers top up in-game currency (Diamonds, UC, Genesis Crystals, VP). The customer flow is three steps: pick a game, enter the in-game account ID, then choose a denomination and a payment method.

This repository is a **migration from a hand-written static site** — three standalone HTML files with a CDN-loaded Tailwind build — into a typed, component-driven Next.js application. The visual identity (colours, typography, spacing, gradients, motion) was carried over deliberately, not redesigned.

## Screenshots

| Game detail | Checkout |
| :---: | :---: |
| ![Game detail page](docs/game-detail.jpg) | ![Payment page](docs/payment.jpg) |

| Home (full page) | Mobile |
| :---: | :---: |
| ![Home page full](docs/home-full.jpg) | <img src="docs/mobile-home.jpg" width="260" alt="Mobile home" /> <img src="docs/mobile-game.jpg" width="260" alt="Mobile game detail" /> |

## Features

**Customer-facing**

- Hero carousel with autoplay, looping and clickable pagination
- Live game search with keyboard shortcut (<kbd>Ctrl</kbd>+<kbd>K</kbd>)
- Working category filter derived from the catalog (empty categories never render)
- Three-step checkout with inline validation
- Payment instructions that adapt per method — QRIS / e-wallet shows a QR, bank transfer shows a virtual account number with copy-to-clipboard, Alfamart shows a retail code
- 15-minute payment countdown with an expiry state
- Success modal, dismissible with <kbd>Esc</kbd> or a backdrop click

**Engineering**

- TypeScript `strict` with zero `any`
- All catalog, testimonial and payment data in `data/*.ts` — adding a game is a data edit, not a layout change
- Icon names are a union type (`IconName`), so a typo fails the build instead of rendering an empty box
- Fully responsive, verified at 390 / 768 / 1440 px

## Engineering notes

A few decisions worth calling out, because they are the parts that were not obvious.

### Routing & rendering

Game pages live at `/game/[slug]` and are **statically prerendered** via `generateStaticParams` — six pages, no server round trip. The checkout page reads `searchParams`, so it is server-rendered on demand and marked `noindex`.

The original site used `/game?id=xxx`. Those URLs are still live in the wild, so `middleware.ts` issues a `308` to the clean path. Redirects in `next.config` were not usable here: Next always carries the source query string into the destination, which produced `/game/valorant?id=valorant`. Middleware can strip just the `id` parameter while preserving analytics parameters such as `utm_source`.

### Verifying a migration instead of eyeballing it

"The design looks the same" is not a test. To prove visual parity, both the original HTML and the Next build were rendered in headless Chrome at identical viewports, and a script compared **every text run and every image** — position, size, font size, weight, colour, line height — plus section-level background, gradient and shadow values.

That surfaced four real defects:

1. **Scroll-reveal content was permanently invisible under `prefers-reduced-motion`.** Framer Motion skips the `whileInView` animation but leaves the `opacity: 0` initial state, so anyone with reduced motion enabled saw empty sections. Fixed with a `matchMedia`-backed hook plus a CSS safety net that wins over inline styles.
2. **`group-hover:grad` never generated CSS.** The original HTML applied a custom class where a Tailwind utility was expected, so the card hover effect silently did nothing. Solved by re-declaring the gradient as a real `@utility`, which also makes every variant work.
3. **A breadcrumb lost its whitespace.** JSX strips whitespace adjacent to newlines, so the separators rendered 4px off. Invisible to the eye; obvious to a diff.
4. **Duplicate SVG gradient IDs.** The header and footer both used `id="jg"`, which is invalid HTML. Now unique per instance.

### Accessibility

- The icon set is inline SVG with `aria-hidden`, replacing emoji — emoji render differently on every platform and cannot inherit `currentColor`.
- Decorative icons are hidden from assistive tech; the rating row carries a single `role="img"` label instead of reading "star star star star star".
- Carousel, search, filters and modal are all keyboard operable, with `aria-current`, `aria-pressed` and `aria-expanded` set.
- The home and checkout pages had **no `<h1>` at all** in the original markup. Each now has exactly one, visually hidden so the design is untouched.

### Assets

Source artwork was 19.1 MB of PNG. Converted to WebP it is **1.7 MB** (−91%) with no visible difference, and `next/image` still negotiates AVIF at request time. The social card is a separate 1200×630 JPEG because Facebook and Twitter do not reliably render WebP previews.

Fonts are loaded through `next/font/local`. Only the weights actually present in the markup are declared — the source contained italic, thin and light files that no element ever used.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4 — CSS-first config, one styling method across the project |
| Animation | Framer Motion (scroll reveals, respecting reduced motion) |
| Images | `next/image`, AVIF/WebP negotiation |
| Fonts | `next/font/local` (Outfit, Plus Jakarta Sans, Caveat) |
| SEO | Metadata API, JSON-LD, generated `sitemap.xml` and `robots.txt` |

## SEO & metadata

- Per-page `title` / `description` / canonical / OpenGraph / Twitter card through the Metadata API
- JSON-LD: `Organization`, `WebSite` and `ItemList` on the home page; `Product` (with `AggregateOffer` and `AggregateRating`) and `BreadcrumbList` on each game page
- `sitemap.xml` and `robots.txt` generated from the same data source as the pages, so they cannot drift
- The checkout page is `noindex, nofollow` and excluded from the sitemap
- Every image has descriptive `alt` text; heading order is `h1 → h2 → h3` with no skipped levels

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://juegova.net` | Canonical origin used by metadata, the sitemap and `robots.txt`. Set this when deploying to another domain. |

## Project structure

```
app/
  layout.tsx              root layout, fonts, global metadata
  page.tsx                home
  game/[slug]/page.tsx    game detail (SSG, generateStaticParams)
  pembayaran/page.tsx     checkout (dynamic, noindex)
  sitemap.ts robots.ts    generated crawler files
  not-found.tsx           branded 404
components/
  layout/                 header, footer, logo, search, mobile nav
  home/                   hero slider, marquee, catalog, testimonials
  game/                   banner, top-up flow, order summary
  payment/                stepper, countdown, instructions, QR
  ui/                     icon set, reveal, avatar, stars, JSON-LD
data/                     catalog, payments, testimonials, features, navigation
lib/                      site config, metadata, JSON-LD, pricing, formatting
types/                    shared domain types
middleware.ts             legacy /game?id= → /game/[slug] redirect
```

## Placeholders & roadmap

This build is front-end complete. These pieces need real values or a backend before going live:

- **Payment gateway.** The QR is a deterministic decorative pattern, not a scannable code, and the virtual account numbers are generated client-side. Prices also arrive from the URL and must be re-validated server-side.
- **Auth.** Login and register are still inert links.
- **Contact details.** WhatsApp number, social URLs and legal pages are empty.
- **Newsletter.** The form reports success locally; no endpoint is wired up yet.
- **Reviews.** The 4.9 / 12,480 rating and the review quotes are the original mock content.

## Author

Built by [@ersetdigital-sudo](https://github.com/ersetdigital-sudo).
