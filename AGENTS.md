# AGENTS.md

Instructions for AI agents (Claude Code, Cursor, Copilot) working on this project.

## Project Overview

A dental clinic website ("DentalCare") built with Next.js 16, React 19, and Tailwind CSS 4. Serbian language is used for all user-facing content.

## Commands

```bash
npm run dev            # Start development server (http://localhost:3000)
npm run build          # Build for production
npm run lint           # Run ESLint
tsc --noEmit           # Type-check without emitting files
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open Prisma Studio (database GUI)
```

## Stack

- Next.js 16.1.0 (App Router, React Server Components)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4 with `@tailwindcss/postcss`
- shadcn/ui (radix-vega style, RSC-compatible)
- tRPC 11.8.1 (type-safe API layer)
- Prisma 7.3.0 (ORM)
- PostgreSQL (database via @prisma/adapter-pg)
- Better Auth (authentication with Prisma adapter)
- TanStack Query v5 (data fetching and caching)
- SuperJSON (serialization for tRPC)
- MinIO (S3-compatible file storage)
- react-hook-form for forms
- Zod for validation
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
      settings/           # Settings (route-based tabs)
        layout.tsx        # Shared header + navigation
        page.tsx          # Redirect to /working-hours
        working-hours/    # Working hours settings
        non-working-days/ # Non-working days settings
        service-types/    # Service types settings
      blog/page.tsx     # Blog management (under construction)
  api/
    auth/[...all]/route.ts  # Better Auth API routes
    trpc/[trpc]/route.ts    # tRPC API endpoint
  layout.tsx            # Root layout (fonts, metadata)
  globals.css           # Tailwind + shadcn theme (OKLCH colors)

trpc/                   # tRPC configuration
  init.ts               # Context, procedures (public/protected/admin)
  server.tsx            # RSC integration (prefetch, HydrateClient)
  client.tsx            # Client provider (TRPCReactProvider, useTRPC)
  query-client.ts       # React Query configuration
  root-router.ts        # Root router aggregation

prisma/
  schema.prisma         # Database schema (all models)

lib/
  prisma.ts             # Prisma client singleton
  auth-server.ts        # Better Auth with Prisma adapter
  auth-client.ts        # Better Auth client configuration
  minio.ts              # S3-compatible storage client
  timezone.ts           # Serbia timezone utilities (Europe/Belgrade)
  utils.ts              # Utility functions (cn helper)
  generated/prisma/     # Generated Prisma client

module/                 # Feature modules (domain-driven structure)
  public/
    home/components/    # Home page components
    shared/components/  # Shared public components (navbar, footer)
  admin/
    shared/components/  # AdminLayout, AdminSidebar, AdminSidebarMobile
    dashboard/          # Dashboard view and stats components
    termini/            # Appointment table, dialogs (confirm, reject, reschedule)
    patients/           # Patients view and table
    podesavanja/        # Settings components and skeletons
      components/       # Tab components (working-hours/, non-working-days-tab, service-types-tab)
      views/            # Shared views (settings-header, settings-nav)
    about/              # About page CMS management
    types/              # Zod schemas for settings
  auth/
    components/         # Auth forms (login, register)
  appointment/
    server/appointment-router.ts  # Appointment tRPC router
  patient/
    server/patient-router.ts      # Patient tRPC router
  settings/
    server/settings-router.ts     # Settings tRPC router
  about/
    server/about-router.ts        # About CMS tRPC router
  upload/
    server/upload-router.ts       # File upload tRPC router
  attachment/
    server/attachment-router.ts   # Attachment tRPC router
  medical-record/
    server/medical-record-router.ts # Medical record tRPC router

components/
  ui/                   # shadcn/ui components (radix-vega style)
  providers/            # React context providers (tRPC, Theme)
  shared/               # Shared components (ConfirmDialog, etc.)

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

## III. Backend (tRPC + Prisma)

### Schema

Define models in `prisma/schema.prisma`. After changes, run:

```bash
npx prisma db push     # Push to database
npx prisma generate    # Regenerate client
```

### Router Structure

Create routers in `module/{domain}/server/{domain}-router.ts`:

```ts
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/trpc/init';

export const patientRouter = createTRPCRouter({
  // Query - read operations
  getAll: adminProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.patient.findMany({
        where: input.query
          ? { firstName: { contains: input.query, mode: 'insensitive' } }
          : {},
      });
    }),

  // Mutation - write operations
  create: adminProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.patient.create({ data: input });
    }),
});
```

### Procedures

Three authorization levels from `@/trpc/init`:

- `publicProcedure` - No authentication required
- `protectedProcedure` - Requires valid session (`ctx.session`)
- `adminProcedure` - Requires admin role

### Context

Available in all procedures via `ctx`:

- `ctx.prisma` - Prisma client for database operations
- `ctx.session` - User session (null for public, guaranteed for protected/admin)
- `ctx.headers` - Request headers

### Error Handling

Use `TRPCError` for standardized errors:

```ts
import { TRPCError } from '@trpc/server';

if (!patient) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Pacijent nije pronaden',
  });
}
```

Common codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `PRECONDITION_FAILED`

### Register Routers

Add new routers to `trpc/root-router.ts`:

```ts
import { patientRouter } from '@/module/patient/server/patient-router';

export const appRouter = createTRPCRouter({
  patient: patientRouter,
  // ... other routers
});
```

Referentni primer: `module/patient/server/patient-router.ts`

### Data Fetching Pattern (Prefetch + Suspense)

Preporuceni pattern za data fetching koristi server-side prefetch sa Suspense i skeleton loaderima.

**1. Server Component (Page) - prefetch + HydrateClient:**

```tsx
// app/(admin)/admin/settings/working-hours/page.tsx
import { WorkingHoursSkeleton } from '@/module/admin/podesavanja/components/working-hours/working-hours-skeleton';
import { WorkingHoursTab } from '@/module/admin/podesavanja/components/working-hours/working-hours-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function WorkingHoursPage() {
  void prefetch(trpc.settings.getWorkingHours.queryOptions());

  return (
    <HydrateClient loadingFallback={<WorkingHoursSkeleton />}>
      <WorkingHoursTab />
    </HydrateClient>
  );
}
```

**2. Client Component - useSuspenseQuery:**

```tsx
// module/admin/podesavanja/components/working-hours/working-hours-tab.tsx
'use client';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { useTRPC } from '@/trpc/client';

export function WorkingHoursTab() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // useSuspenseQuery - suspenduje dok se podaci ne ucitaju
  // HydrateClient prikazuje skeleton tokom suspense-a
  const { data: workingHours } = useSuspenseQuery(
    trpc.settings.getWorkingHours.queryOptions()
  );

  // Mutations ostaju iste
  const { mutate: upsertWorkingHours, isPending } = useMutation(
    trpc.settings.upsertWorkingHours.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['settings']] });
        toast.success('Radno vreme sacuvano');
      },
      onError: (error) => {
        toast.error('Greska pri cuvanju', {
          description:
            error instanceof Error ? error.message : 'Nepoznata greska',
        });
      },
    })
  );

  // workingHours je uvek definisan (nije undefined) zahvaljujuci Suspense-u
  return <div>{/* render workingHours */}</div>;
}
```

**3. Skeleton Component:**

```tsx
// module/admin/podesavanja/components/working-hours/working-hours-skeleton.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function WorkingHoursSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Radno vreme po danima</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-[100px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

Referentni primer: `app/(admin)/admin/settings/working-hours/page.tsx`

### Prednosti ovog patterna

- **Instant loading state**: Skeleton se prikazuje odmah dok se podaci ucitavaju
- **No loading checks**: `useSuspenseQuery` garantuje da su podaci uvek dostupni (nije potrebno `if (isLoading)`)
- **Server prefetch**: Podaci se prefetch-uju na serveru, hydrate-uju na klijentu
- **Type safety**: `data` nikad nije `undefined`

### Mutations

Mutations ostaju iste - koriste `useMutation`:

```tsx
const { mutate, isPending } = useMutation(
  trpc.domain.action.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['domain']] });
      toast.success('Uspesno sacuvano');
    },
    onError: (error) => {
      toast.error('Greska', {
        description:
          error instanceof Error ? error.message : 'Nepoznata greska',
      });
    },
  })
);
```

### Backend-first Logic

Sva transformacija i normalizacija podataka mora biti u tRPC routerima, ne na frontendu.

Los primer (FE logika):

```tsx
// NE RADI OVO - logika na frontendu
const { data: workingHours } = useQuery(
  trpc.settings.getWorkingHours.queryOptions()
);

const fullWeek = workingHours?.map((h) => ({
  ...h,
  dayName: DAY_NAMES[h.dayOfWeek],
}));
```

Dobar primer (BE logika):

```ts
// RADI OVO - logika u tRPC routeru
// module/settings/server/settings-router.ts
export const settingsRouter = createTRPCRouter({
  getWorkingHours: publicProcedure.query(async ({ ctx }) => {
    const hours = await ctx.prisma.workingHour.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

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
  }),
});
```

### TanStack Table

Za sve tabele u aplikaciji koristi TanStack Table sa sledecom strukturom:

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

### Forms (Field + react-hook-form)

Za forme koristi `Field` komponentu sa `react-hook-form` i `Controller`:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(2, 'Naziv mora imati najmanje 2 karaktera'),
});

export function ExampleForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Naziv</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">Sacuvaj</Button>
    </form>
  );
}
```

**Komponente:**

- `Field` - wrapper sa `data-invalid` za error styling
- `FieldGroup` - grupise vise polja
- `FieldLabel` - label za polje
- `FieldError` - prikazuje greske
- `FieldDescription` - opis polja (opciono)

## IV. File Storage (MinIO)

Za upload fajlova koristi MinIO S3-kompatibilni storage:

```ts
// Upload flow:
// 1. Get presigned URL from upload router
const { mutate: getUploadUrl } = useMutation(
  trpc.upload.getUploadUrl.mutationOptions()
);

// 2. Upload directly to MinIO using presigned URL
await fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});

// 3. Save file reference in database
```

Referentni primer: `module/upload/server/upload-router.ts`

## V. Figma Integration

When importing assets via Figma MCP:

- **Never** retain generated hash/random filenames
- Always rename to descriptive, semantic names (e.g., `hero-bg.png` instead of `vector_12ab.svg`)

## VI. Communication

1. **Tone**: Natural, friendly but professional. Simple, direct language.
2. **Language**: Serbian for UI text and user-facing content. English for code and comments.
3. **Clarity**: Ask clarifying questions if anything is unclear before implementation.

## VII. Project Conventions

- Use `@/` path alias for all imports
- Styling with `cn()` utility from `@/lib/utils`
- Forms with `Field` component + `react-hook-form` + Zod validation
- Icons from `lucide-react`
- Images in `assets/`, exported through `data/data.ts`
- Navigation defined in `constants/navigations.ts`
- Feature components go in `module/` organized by domain
- tRPC routers organized by domain in `module/{domain}/server/`
- Zod schemas in `module/{domain}/types/`

## VIII. Admin Module

- **Views**: Main page content in `module/admin/{domain}/views/`
- **Components**: Feature components in `module/admin/{domain}/components/`
- **Shared**: Layout and navigation in `module/admin/shared/components/`
- **Protection**: All admin pages use `requireAdmin()` from `@/module/auth/lib/auth-utils`
- **Navigation**: Defined in `constants/admin-navigation.ts`

Admin interfejs (`/admin`) omogucava upravljanje klinikom:

- **Kontrolna tabla** - Dashboard sa statistikama
- **Termini** - Pregled i upravljanje zakazanim terminima (potvrda, odbijanje, pomeranje)
- **Pacijenti** - Lista registrovanih pacijenata
- **Podesavanja** (`/admin/settings/*`) - Radno vreme, neradni dani, vrste usluga (route-based tabs)
- **O nama** - CMS za About stranicu (vrednosti, milestones, tim)
- **Blog** - Upravljanje blog sadrzajem (u izradi)
