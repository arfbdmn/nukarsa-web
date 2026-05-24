# N-IMS Web Platform Execution Checklist

- [x] **Phase 1: Initializing Workspace & Dependencies**
  - [x] Copy core skeleton files from `..\nukarsa-web` to active workspace `web-nukarsa`
  - [x] Run `npm install` to load all packages (React 19, Framer Motion, Tailwind 4, Supabase)
  - [x] Create `supabase_schema.sql` file in the root for easy user database setups

- [ ] **Phase 2: Database Setup & Configuration**
  - [ ] Confirm `applications` table includes new fields: `country` and `identity_card`
  - [ ] Test Supabase DB connection using local scripts or validation
  - [ ] Make sure storage bucket and RLS policies match updated fields

- [x] **Phase 3: Marketing Pages Refactoring (SEO & Emojis)**
  - [x] Refactor pages in `(marketing)` to Next.js Server Components (SSR-first)
  - [x] Fix icon/emoji encoding corruptions in `about/page.tsx`, `legality/page.tsx`, `contact/page.tsx`, `thanks/page.tsx`
  - [x] Ensure proper `<Image>` optimization and metadata titles

- [x] **Phase 4: Token-Based Booking Flow & Forms**
  - [x] Implement query token validation on `/booking?token=UUID`
  - [x] Build "Access Denied / Invalid Token" error states
  - [x] Update booking form inputs to include **Country** and **Identity Card**
  - [x] Complete secure submit action (save application, upload passport, mark token as used)
  - [x] Adjust thanks page to include pre-filled WhatsApp click-to-chat links

- [x] **Phase 5: Realtime Admin Command Center**
  - [x] Build secure Admin Login at `/admin/login`
  - [x] Implement session checking and protection on `/admin/dashboard`
  - [x] Construct beautiful glassmorphic Command Center layout with live metrics
  - [x] Set up Supabase Realtime subscription to animate new inquiries in instantly
  - [x] Build the Admin Token Generator utility (name, email, duration inputs)
  - [x] Integrate status change controls and audit log insertions into `status_updates`

- [x] **Phase 6: CMS & i18n Dictionary**
  - [x] Design lightweight English (EN) and Indonesian (ID) language dictionary toggle
  - [x] Configure dynamic copy-fetching from `cms_content` or local dictionaries
  - [x] Add basic CMS editing capabilities in the admin dashboard settings tab

- [x] **Phase 7: Final Verification & Walkthrough**
  - [x] Build and compile the Next.js bundle locally (`npm run build`)
  - [x] Run comprehensive manual UX verification flows
  - [x] Document changes in `walkthrough.md` with final screenshots
