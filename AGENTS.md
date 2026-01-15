# AGENTS.md

Instructions for AI agents (Claude Code, Cursor, Copilot) working on this project.

## Project Overview

A dental clinic website ("DentalCare") built with Next.js 16, React 19, and Tailwind CSS 4. Serbian language is used for all user-facing content.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run convex   # Start Convex dev server (run in separate terminal)
npm run build    # Build for production
npm run lint     # Run ESLint
tsc --noEmit     # Type-check without emitting files
```

## Stack

- Next.js 16.1.0 (App Router, React Server Components)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4 with `@tailwindcss/postcss`
- shadcn/ui (radix-vega style, RSC-compatible)
- Convex (serverless backend with real-time sync)
- Better Auth (authentication with Convex adapter)
- react-hook-form for forms
- @tanstack/react-table for tables
- date-fns for date utilities
- lucide-react for icons

## Directory Structure

```
app/                    # Next.js App Router
  (public)/             # Route group for public pages
    layout.tsx          # Public layout with navbar
    page.tsx            # Home page
  (admin)/              # Route group for admin pages
    layout.tsx          # Admin layout wrapper
    admin/
      page.tsx          # Dashboard (kontrolna tabla)
      loading.tsx       # Loading state
      termini/page.tsx  # Appointments management
      patients/page.tsx # Patients list
      podesavanja/page.tsx # Settings (working hours, services)
      blog/page.tsx     # Blog management (under construction)
  api/auth/             # Better Auth API routes
  layout.tsx            # Root layout (fonts, metadata)
  globals.css           # Tailwind + shadcn theme (OKLCH colors)

convex/                 # Convex backend
  _generated/           # Auto-generated Convex types
  betterAuth/           # Better Auth component
    schema.ts           # Better Auth database tables
    auth.ts             # Auth configuration for CLI
    adapter.ts          # Database adapter API
    convex.config.ts    # Component definition
  lib/
    timezone.ts         # Serbia timezone utilities (Europe/Belgrade)
  schema.ts             # Database schema (workingHours, appointments, patients, etc.)
  settings.ts           # Clinic settings (working hours, services, non-working days)
  appointments.ts       # Appointment booking and management
  patients.ts           # Patient management
  users.ts              # User roles and management
  auth.ts               # Auth component integration
  http.ts               # HTTP routes for auth endpoints
  convex.config.ts      # App configuration with Better Auth
  auth.config.ts        # Auth providers configuration

module/                 # Feature modules (domain-driven structure)
  public/
    home/components/    # Home page components
    shared/components/  # Shared public components (navbar, footer)
  admin/
    shared/components/  # AdminLayout, AdminSidebar, AdminSidebarMobile
    dashboard/          # Dashboard view and stats components
    termini/            # Appointment table, dialogs (confirm, reject, reschedule)
    patients/           # Patients view and table
    podesavanja/        # Settings tabs (working hours, non-working days, services)
    types/              # Zod schemas for settings
  auth/
    components/         # Auth forms (login, register)

components/
  ui/                   # shadcn/ui components (radix-vega style)
  providers/            # React context providers (Convex, Theme)

lib/
  utils.ts              # Utility functions (cn helper)
  auth-client.ts        # Better Auth client configuration
  auth-server.ts        # Better Auth server configuration

constants/              # App-wide constants (navigation links)
data/                   # Static data exports (services, team, testimonials)
assets/                 # Static images (imported via Next.js Image)
hooks/                  # Custom React hooks
```

## I. Task Execution

1. **Plan Mode first**: Start every request with a Plan Mode phase. Break down the task into 3-5 concrete steps (Plan, Research, Implement, Validate).
2. **Context before code**: Always check existing project structure, patterns, and tech stack before implementation.
3. **Multi-tool research**: Combine Tavily (industry insights), Context7 (documentation), and next-devtools (Next.js analysis). Never use single-tool research.
4. **Sequential thinking**: Use Sequential-thinking approach for complex problems, debugging, and architecture planning.

## II. Code Quality

1. **TypeScript first**: Always apply robust TypeScript types. Run `tsc --noEmit` before suggesting changes.
2. **Component atomicity**: Decompose large components into smaller, focused sub-components. Group them in a folder with hierarchical naming (e.g., folder `booking-form` contains `booking-form.tsx`, `booking-form-fields.tsx`, `booking-form-submit.tsx`).
3. **Minimalism**: Implement only what is needed. Avoid unused, speculative, placeholder, or commented-out code.
4. **Error handling**: Include error handling, error boundaries, and edge cases.
5. **Import order**: Write usage first, then import (prevents auto-removal of unused imports).

## III. Backend (Convex)

- **Schema**: Define tables in `convex/schema.ts` using `defineTable` and validators from `convex/values`
- **Queries**: Use `query()` for read operations (real-time by default)
- **Mutations**: Use `mutation()` for write operations
- **Backend-first logic**: All data transformation/normalization happens in Convex functions, not frontend
- **HTTP routes**: Define API endpoints in `convex/http.ts` for auth and external integrations
- **Timezone handling**: Use `convex/lib/timezone.ts` for Serbia timezone (Europe/Belgrade)
- **Auth**: Better Auth component in `convex/betterAuth/` with admin plugin

### Backend-first Logic Examples

Sva transformacija, normalizacija i priprema podataka mora biti u Convex funkcijama, a ne na frontendu. Frontend komponente treba da dobiju podatke "spremne za upotrebu" bez dodatne obrade.

Loš primer (FE logika):

```tsx
// ❌ NE RADI OVO - logika na frontendu
const workingHours = useQuery(api.settings.getWorkingHours);

useEffect(() => {
  const fullWeek = Array.from({ length: 7 }, (_, i) => {
    const existing = workingHours?.find((h) => h.dayOfWeek === i);
    return {
      dayOfWeek: i,
      startTime: existing?.startTime ?? '08:00',
      isOpen: existing?.isOpen ?? true,
    };
  });
  setHours(fullWeek);
}, [workingHours]);
```

Dobar primer (BE logika):

```ts
// ✅ RADI OVO - logika u Convex query-ju
// convex/settings.ts
export const getWorkingHours = query({
  args: {},
  handler: async (ctx) => {
    const hours = await ctx.db.query('workingHours').collect();

    // Normalizacija na BE - vrati kompletnu nedelju
    return Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = hours.find((h) => h.dayOfWeek === dayOfWeek);
      return (
        existing ?? {
          dayOfWeek,
          startTime: '08:00',
          endTime: '17:00',
          isOpen: dayOfWeek !== 0 && dayOfWeek !== 6,
        }
      );
    });
  },
});
```

```tsx
// Frontend komponenta - jednostavna, bez transformacije
const workingHours = useQuery(api.settings.getWorkingHours);
// `workingHours` je već spreman za renderovanje
```

### Data Fetching Examples

**Queries** - za čitanje podataka (real-time by default):

```tsx
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function MyComponent() {
  const data = useQuery(api.myModule.myQuery);

  if (data === undefined) return <Loading />;
  // data is ready
}
```

**Preloaded Queries** - prefetch na serveru (preferirano kada je moguće):

Server Component (Page):

```tsx
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export default async function Page() {
  const preloadedData = await preloadQuery(api.myModule.myQuery);
  return <MyView preloadedData={preloadedData} />;
}
```

Client Component (View):

```tsx
'use client';
import { usePreloadedQuery, type Preloaded } from 'convex/react';
import type { api } from '@/convex/_generated/api';

interface MyViewProps {
  preloadedData: Preloaded<typeof api.myModule.myQuery>;
}

export function MyView({ preloadedData }: MyViewProps) {
  const data = usePreloadedQuery(preloadedData);
  // data is ready, no loading state needed
}
```

Referentni primer: `app/(admin)/admin/o-nama/page.tsx` + `module/admin/about/views/about-admin-view.tsx`

**Suspense sa useQuery komponentama**

Kada komponenta koristi `useQuery` (a ne `usePreloadedQuery`), MORA biti upakovana u `<Suspense>` sa odgovarajućim fallback-om:

```tsx
// Parent komponenta
import { Suspense } from 'react';

function ParentView() {
  return (
    <div>
      {/* Komponenta sa preloaded data - BEZ Suspense */}
      <WorkingHoursTab preloadedData={preloadedWorkingHours} />

      {/* Komponenta sa useQuery - SA Suspense */}
      <Suspense fallback={<TabSkeleton />}>
        <NonWorkingDaysTab />
      </Suspense>
    </div>
  );
}
```

**Pravila:**

- `usePreloadedQuery` → Podaci su već učitani na serveru, **bez Suspense**
- `useQuery` → Podaci se učitavaju na klijentu, **sa Suspense i fallback**

Referentni primer: `module/admin/podesavanja/views/settings-view.tsx`

**Mutations** - za izmenu podataka (TanStack Query integracija):

Koristimo `@convex-dev/react-query` za integraciju sa TanStack Query. Ovo omogućava `onSuccess`, `onError` callback-ove i `isPending` state direktno iz hook-a.

```tsx
'use client';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';

export default function MyComponent() {
  // 1. Definiši mutationFn kao posebnu konstantu
  const updateDataFn = useConvexMutation(api.myModule.myMutation);

  // 2. Koristi je u useMutation hook-u
  const { mutate: updateData, isPending } = useMutation({
    mutationFn: updateDataFn,
    onSuccess: () => {
      toast.success('Uspešno sačuvano');
    },
    onError: (error) => {
      toast.error('Greška pri čuvanju', {
        description:
          error instanceof Error ? error.message : 'Nepoznata greška',
      });
    },
  });

  const handleSubmit = () => {
    updateData({ field: 'value' });
  };

  return (
    <Button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Čuvanje...' : 'Sačuvaj'}
    </Button>
  );
}
```

**Napomena**: `QueryClientProvider` je već konfigurisan u `components/providers/convex-provider.tsx`.

Referentni primer: `module/admin/podesavanja/components/working-hours-tab.tsx`

**Convex functions** (`convex/*.ts`):

```ts
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const myQuery = query({
  args: { id: v.id('myTable') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const myMutation = mutation({
  args: { field: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('myTable', { field: args.field });
  },
});
```

Referentni primer: `module/public/home/components/hero/booking-form.tsx`

### TanStack Table

Za sve tabele u aplikaciji koristi TanStack Table sa sledećom strukturom:

```
module/{area}/{domain}/components/{domain}-table/
  {domain}-table.tsx              # Main table component
  {domain}-table-columns.tsx      # Column definitions (ColumnDef)
  {domain}-table-pagination.tsx   # Pagination controls
  {domain}-table-toolbar.tsx      # Search, filters, actions
  {domain}-table-row-actions.tsx  # Row action buttons (edit, delete)
```

Primer upotrebe (`{domain}-table.tsx`):

```tsx
'use client';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

import { columns } from './{domain}-table-columns';

export function DomainTable({ data }: { data: Item[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
  });

  return <Table>{/* ... flexRender for headers and cells */}</Table>;
}
```

Referentni primer: `module/admin/patients/components/patients-table/`

## IV. Figma Integration

When importing assets via Figma MCP:

- **Never** retain generated hash/random filenames
- Always rename to descriptive, semantic names (e.g., `hero-bg.png` instead of `vector_12ab.svg`)

## V. Communication

1. **Tone**: Natural, friendly but professional. Simple, direct language.
2. **Language**: Serbian for UI text and user-facing content. English for code and comments.
3. **Clarity**: Ask clarifying questions if anything is unclear before implementation.

## VI. Project Conventions

- Use `@/` path alias for all imports
- Styling with `cn()` utility from `@/lib/utils`
- Forms with `react-hook-form`
- Icons from `lucide-react`
- Images in `assets/`, exported through `data/data.ts`
- Navigation defined in `constants/navigations.ts`
- Feature components go in `module/` organized by domain
- Convex functions organized by domain in `convex/` folder

## VII. Admin Module

- **Views**: Main page content in `module/admin/{domain}/views/`
- **Components**: Feature components in `module/admin/{domain}/components/`
- **Shared**: Layout and navigation in `module/admin/shared/components/`
- **Protection**: All admin pages use `requireAdmin()` from `@/module/auth/lib/auth-utils`
- **Navigation**: Defined in `constants/admin-navigation.ts`

Admin interfejs (`/admin`) omogućava upravljanje klinikom:

- **Kontrolna tabla** - Dashboard sa statistikama
- **Termini** - Pregled i upravljanje zakazanim terminima (potvrda, odbijanje, pomeranje)
- **Pacijenti** - Lista registrovanih pacijenata
- **Podešavanja** - Radno vreme, neradni dani, vrste usluga
- **Blog** - Upravljanje blog sadržajem (u izradi)
