# Nukarsa — Four Production-Grade Enhancements

Coordinated engineering pass to add an Our Clients feature, branding placeholders, a refactored language/i18n system, and a responsive audit.

## Codebase Analysis Summary

**Project stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4 (no `tailwind.config.js`; uses `@theme inline` in `globals.css`), Framer Motion, Supabase, TypeScript.

**Route groups**:
- `(marketing)` — pages: `/` (home), `/about`, `/services`, `/contact`, `/legality`
- `(system)` — pages: `/booking`, `/thanks`
- `admin` — pages: `/admin`, `/admin/login`

**Existing i18n**: Flat key dictionary in [LanguageContext.tsx](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/components/LanguageContext.tsx) with `useLanguage()` hook returning `{ t, language, setLanguage }`. Already consumed by `LandingPage.jsx` and `Navbar.jsx`. Server Components (`about`, `contact`, `legality`, `services`) have **hardcoded strings** (not translated).

**Key constraints**:
- About, Contact, Legality, Services pages are **Server Components** (they export `metadata` and have no `"use client"`)
- Booking/Thanks pages are Client Components
- Framer Motion is already installed → CSS-only animations preferred but Framer OK where already used
- Tailwind v4 = no `tailwind.config.js`, no `darkMode` config; dark styling is done with explicit class names (e.g., `bg-slate-900`)

---

## Proposed Changes

### Task 1 — Our Clients Feature

#### [NEW] [clients.ts](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/lib/data/clients.ts)

Shared client data array with TypeScript typing. Contains 6 mock clients (Pertamina, Bank Mandiri, Telkom Indonesia, Astra International, Garuda Indonesia, BRI Insurance) each with `id`, `name`, `industry`, `logo`, and `description` fields.

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/components/LandingPage.jsx)

- Import `clients` from `lib/data/clients.ts`
- Add `OurClientsSection` between **Services** (section 4) and **Office Gallery** (section 5)
- Desktop: CSS-only auto-scrolling horizontal marquee using `@keyframes marquee` animation
- Mobile (`< md`): Static 2-column grid (`grid-cols-2`)
- Each logo card: `group` wrapper with Tailwind-only tooltip (`group-hover:opacity-100`, absolute positioned)
- Logo images: `next/image` with the specified comment block, `grayscale hover:grayscale-0` treatment
- "View All Clients" link to `/clients`

#### [NEW] [page.tsx](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/app/(marketing)/clients/page.tsx)

- Server Component wrapper with `metadata` export
- Client sub-component for interactive tooltip cards
- Glassmorphic card grid: `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl`
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-6`
- Dark hero header with heading + subtitle
- Each card shows: logo, name, industry pill, mock description
- Tooltip on hover mirroring landing page pattern

---

### Task 2 — Branding Asset Placeholders

#### [MODIFY] [Navbar.jsx](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/components/Navbar.jsx)

- Replace the text-based `NUKARSA` logo link (line 17-19) with `next/image` placeholder block
- Add `import Image from "next/image"` (Link already imported)
- Preserve all existing className logic, mobile menu, and `LanguageToggle`
- Exact comment block as specified

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/components/LandingPage.jsx)

- Add hero logo block **above** the `<h1>NUKARSA</h1>` in the hero `<header>` section
- `Image` is already imported
- Exact comment block as specified

---

### Task 3 — Language Context Refactor

#### [NEW] [translations.ts](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/lib/i18n/translations.ts)

Centralized nested translation dictionary with `en` and `id` locales. Structure:
- `nav.*` — Navbar links
- `hero.*` — Hero section
- `about.*` — About section (landing + about page)
- `values.*` — Value proposition cards
- `services.*` — Services section + page
- `clients.*` — Clients section
- `gallery.*` — Office gallery
- `team.*` — Team section
- `contact.*` — Contact section + page
- `footer.*` — Footer
- `legality.*` — Legality page
- `system.*` — Booking/Thanks system pages

Every visible string from every page will be mapped. `as const` for full type inference.

#### [MODIFY] [LanguageContext.tsx](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/components/LanguageContext.tsx)

Full refactor:
- Import translations from `lib/i18n/translations.ts`
- Dot-notation `t()` function that traverses nested objects (e.g., `t("nav.home")`)
- Typed `Language = "id" | "en"` (preserved)
- `useTranslation()` hook (new name) + backward-compatible `useLanguage()` re-export
- Fallback chain: try current locale → try `"en"` → return key string (never blank)
- `localStorage` key: `"nukarsa_lang"` (matches spec; current code uses `"nukarsa-lang"`)
- `LanguageToggle` component preserved
- Export `useTranslation` as the primary hook

> [!IMPORTANT]
> The existing code exports `useLanguage`. Since `LandingPage.jsx` and `Navbar.jsx` import it, I will **keep `useLanguage` as a re-export alias** of `useTranslation` to avoid breaking existing consumers. New code will use `useTranslation`.

#### Server Components with hardcoded strings

The about, contact, legality, and services pages are **Server Components** that export `metadata`. The i18n hook requires `"use client"`. Strategy:

> [!IMPORTANT]
> **Decision**: For `about`, `contact`, `legality`, and `services` pages — I will extract the text-bearing body into a `"use client"` sub-component within each page file, keeping the server wrapper + metadata export intact. This follows the spec instruction: *"If a page is a Server Component, convert only the text-bearing children to a `"use client"` sub-component."*

---

### Task 4 — Responsive Audit

Apply to every modified component:
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid pattern: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Touch targets: `min-h-[44px] min-w-[44px]` on interactive elements
- No fixed pixel widths on text containers
- `overflow-hidden` on marquee wrapper
- Fluid text: `text-base md:text-lg lg:text-xl`
- Images with proper `sizes` prop
- No overflow on 375px viewport

#### [MODIFY] [globals.css](file:///c:/Users/62895/MyCodes/Node.JS/nukarsa-web/app/globals.css)

Add `@keyframes marquee` animation and `scrollbar-hide` utility for the clients marquee section.

---

## File Change Manifest

```
CREATED  lib/data/clients.ts
CREATED  lib/i18n/translations.ts
CREATED  app/(marketing)/clients/page.tsx
MODIFIED components/LandingPage.jsx     — sections: HeroLogo, OurClients
MODIFIED components/Navbar.jsx          — sections: LogoPlaceholder
MODIFIED components/LanguageContext.tsx  — full refactor
MODIFIED app/globals.css                — marquee keyframes
MODIFIED app/(marketing)/about/page.tsx          — i18n client sub-component
MODIFIED app/(marketing)/contact/page.tsx        — i18n client sub-component
MODIFIED app/(marketing)/legality/page.tsx       — i18n client sub-component
MODIFIED app/(marketing)/services/page.tsx       — i18n client sub-component
MODIFIED components/OfficeGallery.jsx            — i18n strings
```

---

## Open Questions

> [!IMPORTANT]
> **localStorage key change**: The current code uses `"nukarsa-lang"` as the localStorage key. The spec requests `"nukarsa_lang"` (underscore). I will update to `"nukarsa_lang"` per spec — this means any existing users with a saved preference under the old key will reset to the default `"id"`. Is this acceptable, or should I add migration logic that reads the old key first?

> [!NOTE]
> **Booking/Thanks pages**: These are `(system)` route pages with many hardcoded English strings (form labels, status messages, error text). The spec says to translate all visible strings. I will add translation keys for these but **will not modify** any routing logic, auth guards, or API interaction code — only text strings. The booking page has `any` types on `tokenData` and the `catch` block which I will NOT fix per the constraint "do NOT modify `(system)` routing logic".

---

## Verification Plan

### Automated Tests
```bash
npm run build
```
A successful build confirms:
- No TypeScript errors in new/modified files
- All imports resolve correctly
- Server/Client Component boundaries are valid

### Manual Verification
- Check landing page at `/` — hero logo, all sections, clients marquee
- Check `/clients` — dedicated page with card grid
- Toggle language between ID/EN on all pages
- Verify mobile responsiveness at 375px viewport
- Confirm no horizontal overflow on any page
