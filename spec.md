# Pennywise

## Current State
The app has a Provider Dashboard (services, earnings, calendar, messages), a Taker Dashboard (search, booking, payment, review), a HomePage, ContactPage, calling system (CallManagerContext, IncomingCallOverlay, ActiveCallPanel), and profile setup flow. No admin panel exists.

## Requested Changes (Diff)

### Add
- `/admin` route pointing to a new `AdminDashboard` page
- Admin navigation link in AppLayout (visible to all for now, or gated by a simple admin flag)
- `AdminDashboard` page with sidebar navigation and the following sections:
  - **Overview**: KPI cards — total users, total providers, total takers, total bookings, total revenue, active jobs
  - **User Management**: table listing all users with columns: name, email, type (provider/taker/both), status, join date, actions (view/suspend)
  - **Income & Ledger**: income categories table, general ledger entries, vendor income summary — all with mock data
  - **Job Listings**: table of all service listings across all providers with status, price, category, provider name
  - **Client Communications**: recent messages/contact submissions log
  - **Settings**: basic platform configuration fields (platform fee %, support email, maintenance mode toggle)

### Modify
- `App.tsx`: add `adminRoute` for `/admin` path
- `AppLayout` or nav component: add Admin link

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/AdminDashboard.tsx` with sidebar + section routing using state
2. Create admin sub-components under `src/frontend/src/components/admin/`:
   - `AdminOverview.tsx` — KPI cards with mock stats
   - `AdminUsers.tsx` — user table with search/filter
   - `AdminIncomeLedger.tsx` — income heads, GL entries, vendor income tabs
   - `AdminJobListings.tsx` — all services table
   - `AdminCommunications.tsx` — messages log
   - `AdminSettings.tsx` — platform settings form
3. Add `/admin` route to `App.tsx`
4. Add Admin nav entry to the app navigation
