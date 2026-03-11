# Pennywise

## Current State
The app has a Motoko backend with core entities (providers, takers, services, bookings, messages, availability) and a React frontend. Several frontend components are wired to the backend (ServiceSearch, ServiceListings, ProviderCalendar, BookingFlow). However, key sections still use hardcoded mock/static data:
- `EarningsDashboard` — shows static $0.00 values, no backend connection
- `AdminDashboard` — all KPI cards, user tables, income ledger, job listings, and communications use hardcoded arrays
- `MessageCenter` — uses DEMO_CLIENTS array; conversations section shows empty state with no real data

The backend lacks endpoints for: provider earnings/bookings retrieval, admin stats, listing all users, listing all bookings.

## Requested Changes (Diff)

### Add
- Backend: `getBookingsForProvider` — returns all bookings where caller is the provider
- Backend: `getAdminStats` — admin-only, returns counts (totalUsers, totalProviders, totalTakers, totalBookings, totalRevenue)
- Backend: `getAllUsers` — admin-only, returns list of (Principal, UserProfile) pairs
- Backend: `getAllBookings` — admin-only, returns all bookings with IDs
- Backend: `getBookingsForTaker` — returns all bookings where caller is the taker
- Frontend hooks: `useGetBookingsForProvider`, `useGetAdminStats`, `useGetAllUsers`, `useGetAllBookings`

### Modify
- `EarningsDashboard` — wire to `useGetBookingsForProvider` to compute total earnings, monthly earnings, and completed job count; show real booking history
- `AdminDashboard` — wire Overview KPIs to `useGetAdminStats`; wire User Management table to `useGetAllUsers`; wire Job Listings to `getAllServices`; leave Income Ledger/Vendor sections as illustrative (no ledger in backend)
- `MessageCenter` — wire Conversations section to show real messages from `getMessagesWithUser` per provider's clients (derived from bookings)

### Remove
- Hardcoded mock arrays in `EarningsDashboard` (implicit — currently static values replaced with real data)
- Hardcoded `KPI_CARDS`, `USERS_DATA`, `JOB_LISTINGS` in `AdminDashboard`
- `DEMO_CLIENTS` array in `MessageCenter`

## Implementation Plan
1. Update `main.mo` to add `getBookingsForProvider`, `getBookingsForTaker`, `getAdminStats`, `getAllUsers`, `getAllBookings`
2. Regenerate backend bindings
3. Add new query hooks in `useQueries.ts`
4. Rewrite `EarningsDashboard` to use real provider bookings data
5. Rewrite `AdminDashboard` Overview and User Management sections to pull from backend
6. Wire Job Listings section in AdminDashboard to real services from backend
7. Wire MessageCenter Conversations to real message threads derived from provider bookings
