# N-IMS Full Feature Expansion Checklist

- [x] **Phase 1: DB & Translations Setup**
  - [x] Verify database tables (`public.quotations`, `public.token_requests`, `public.sla_config`, `public.notification_logs`) exist in the schema
  - [x] Add comprehensive new translations to `lib/i18n/translations.ts` for English & Indonesian

- [x] **Phase 2: Self-Service Token Request (`/request` page)**
  - [x] Create beautiful, glassmorphic UI page `app/(system)/request/page.tsx`
  - [x] Support form data inputs (full_name, email, phone, visa_type, message)
  - [x] Add submission logic to save into `token_requests` table and handle success/error states

- [x] **Phase 3: Client Status Tracker (`/status` page)**
  - [x] Create gorgeous public tracking page `app/(system)/status/page.tsx`
  - [x] Implement search by Booking Token UUID
  - [x] Fetch and display application status, SLA processing details, invoices (Quotations), uploaded docs, and full updates log

- [x] **Phase 4: Admin Dashboard Tabs (Quotations & Token Requests)**
  - [x] Add tab UI navigation at `app/admin/page.tsx` for "Quotations" and "Requests"
  - [x] Implement "Token Requests" tab with Approve (auto-generate booking token) and Reject (with reason notes)
  - [x] Implement "Quotations" tab to create, read, and update invoices for client applications
  - [x] Automatically log system notifications to `notification_logs` when updating status or approving/rejecting requests
  - [x] Display SLA info dynamically in forms and modals

- [x] **Phase 5: Academic Documentation Creation**
  - [x] Generate comprehensive Indonesian academic documents in `docs/dokumentasi_akademik_kp.md` (ERD, LRS, Database Schema, UML Use Case, Activity, Sequence diagrams, Wireframes, UI/UX philosophy)

- [x] **Phase 6: Verification & Compilation**
  - [x] Test end-to-end user flows (request token -> admin approve -> book visa -> issue quotation -> track status)
  - [x] Run `npm run build` to confirm zero compilation errors
