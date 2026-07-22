# eLog

Enterprise logistics management portal MVP built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, Lucide Icons, TanStack Table, React Hook Form, Zod, Recharts, date-fns, next-themes, and Sonner.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy to Cloudflare Pages

This project is configured for Cloudflare Pages static hosting.

Cloudflare Pages settings:

```text
Framework preset: Next.js (Static HTML Export)
Build command: pnpm build
Build output directory: out
Node.js version: 20 or newer
```

`next.config.ts` uses `output: "export"`, so `pnpm build` writes the deployable static site to `out/`.

For full-stack SSR Next.js on Cloudflare, use the Cloudflare Workers + OpenNext adapter instead. This eLog MVP uses mock/client data, so static Pages output is the lighter deployment path.

## Source Structure

```text
app/
  layout.tsx        Root layout, theme provider, metadata, toast host
  (portal)/
    layout.tsx      Authenticated portal shell wrapper
    page.tsx        Dashboard route at /
    [module]/page.tsx
                    Module routes such as /bookings, /shipments, /drivers
  globals.css       shadcn CSS variables and enterprise logistics theme
components/
  app-toaster.tsx   Sonner toast host
  portal/           Sidebar, header, responsive portal shell
  shared/           PageHeader, Panel, StatusBadge, StatCard, Timeline, states, dialogs
  theme-provider.tsx
  ui/button.tsx     shadcn/ui button primitive
features/
  dashboard/        Dashboard page and charts
  modules/          Generic module list/detail/forms/table/extras
lib/
  elog/             Types, constants, schemas, mock data, mock service hook
  utils.ts          Shared className utility
```

## Completed Modules

- Dashboard with KPI cards, charts, recent activities, and operational alerts.
- Booking Management with list, filters, sorting, pagination, bulk actions, detail, create, edit, Zod validation, and confirmation dialogs.
- Shipment Management with milestone-oriented detail UI.
- Container Tracking with route visual, movement timeline, reefer temperature field, and document/activity areas.
- Truck Appointment with list and day/week/month slot calendar mock.
- Vehicle and Driver Management.
- Document Center with drag-and-drop style upload, preview, replace/archive/delete mock actions.
- Billing, Invoices, and Payments.
- Customer and Partner Management.
- Notifications center with read state mock data.
- Reports with summary cards, chart/table export mock actions.
- User and Role Management with permission matrix.
- Master Data management.
- System Settings with configuration and integration tabs.

## Mock API Behavior

`lib/elog/mock-service.ts` includes a typed `MockRepository` abstraction that supports list/search flows, simulated 300-800 ms network delay, and a mock error path by searching for `error`. The UI renders loading, skeleton, empty, error, success toast, disabled pagination, permission-denied, and confirmation states.

The data uses realistic logistics samples, including Vietnamese/Southeast Asian ports, major shipping lines, booking/shipment/invoice/appointment/container number formats, and enterprise workflow statuses.
