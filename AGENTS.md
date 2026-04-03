# AGENTS.md

Instructions for AI agents (Claude Code, Cursor, Copilot) working on this project.

## Project Overview

Dental clinic website ("DentalCare") - Next.js 16, React 19, Tailwind CSS 4. Serbian language for UI.

### Project Management

- **ClickUp Workspace ID:** 90152135570
- **ClickUp Space:** Stomatolog (ID: 90158957290)

## Commands

```bash
npm run dev            # Dev server (localhost:3000)
npm run build          # Production build
npm run lint           # ESLint
tsc --noEmit           # Type-check
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
npx prisma studio      # Database GUI
```

## Stack

- Next.js 16.1.0 (App Router, RSC)
- React 19.2.3, TypeScript 5
- Tailwind CSS 4, shadcn/ui (radix-vega)
- tRPC 11.8.1, TanStack Query v5
- Prisma 7.3.0, PostgreSQL
- Better Auth, MinIO (S3 storage)
- react-hook-form, Zod, @tanstack/react-table
- date-fns, lucide-react

## Directory Structure

```
app/
  (public)/             # Public pages
  (admin)/admin/        # Admin pages
    settings/           # Route-based tabs (working-hours/, non-working-days/, service-types/)
  api/
    auth/[...all]/      # Better Auth
    trpc/[trpc]/        # tRPC endpoint

trpc/
  init.ts               # Procedures (public/protected/admin)
  server.tsx            # RSC: prefetch, HydrateClient
  client.tsx            # Client: TRPCReactProvider, useTRPC
  root-router.ts        # Router aggregation

lib/
  prisma.ts             # Prisma singleton
  auth-server.ts        # Better Auth config
  events.ts             # SSE EventEmitter, emit helpers
  minio.ts              # S3 storage client

module/                 # Feature modules
  {domain}/
    server/{domain}-router.ts   # tRPC router
    components/                  # UI components
    views/                       # Page views
    types/                       # Zod schemas

components/
  ui/                   # shadcn/ui components
  providers/            # Context providers
```

## Code Quality

1. **TypeScript first** - Run `tsc --noEmit` before changes
2. **Component atomicity** - Split into focused sub-components in folders
3. **Minimalism** - No unused, speculative, or commented-out code
4. **Error handling** - Include error boundaries and edge cases
5. **Backend-first logic** - Data transformation in tRPC routers, not frontend

## Backend (tRPC + Prisma)

### Schema

Define models in `prisma/schema.prisma`, then run `npx prisma db push && npx prisma generate`.

### Router Pattern

Create routers in `module/{domain}/server/{domain}-router.ts`:

```ts
export const domainRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.domain.findMany({ ... });
    }),

  create: adminProcedure
    .input(schema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.domain.create({ data: input });
    }),
});
```

Register in `trpc/root-router.ts`. **Ref:** `module/patient/server/patient-router.ts`

### Procedures & Context

Three levels from `@/trpc/init`:

- `publicProcedure` - No auth
- `protectedProcedure` - Requires session
- `adminProcedure` - Requires admin role

Context: `ctx.prisma`, `ctx.session`, `ctx.headers`

### Error Handling

```ts
throw new TRPCError({ code: 'NOT_FOUND', message: 'Pacijent nije pronaden' });
```

Codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `PRECONDITION_FAILED`

### Data Fetching (Prefetch + Suspense)

**Server Component (Page):**

```tsx
export default function Page() {
  void prefetch(trpc.domain.getAll.queryOptions());
  return (
    <HydrateClient loadingFallback={<Skeleton />}>
      <ClientComponent />
    </HydrateClient>
  );
}
```

**Client Component:**

```tsx
'use client';
const { data } = useSuspenseQuery(trpc.domain.getAll.queryOptions());
// data is never undefined thanks to Suspense
```

**Ref:** `app/(admin)/admin/settings/working-hours/page.tsx`

### Mutations

```tsx
const { mutate, isPending } = useMutation(
  trpc.domain.action.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['domain']] });
      toast.success('Uspesno sacuvano');
    },
    onError: (error) => toast.error('Greska', { description: error.message }),
  })
);
```

### SSE Subscriptions

Real-time updates via tRPC subscriptions:

1. Define events in `lib/events.ts` (EventEmitter + constants)
2. Create subscription in `module/subscriptions/server/subscriptions-router.ts`
3. Emit from mutations: `emitSettingsUpdate(SETTINGS_EVENT_TYPES.WORKING_HOURS_UPDATED)`
4. Subscribe on client with `useSubscription()`

**Ref:** `lib/events.ts`, `module/subscriptions/server/subscriptions-router.ts`

### TanStack Table

Structure for tables:

```
module/{area}/{domain}/components/{domain}-table/
  {domain}-table.tsx              # Main component
  {domain}-table-columns.tsx      # ColumnDef
  {domain}-table-pagination.tsx   # Pagination
  {domain}-table-toolbar.tsx      # Search, filters
  {domain}-table-row-actions.tsx  # Row actions
```

**Ref:** `module/admin/patients/components/patients-table/`

### Forms (Field + react-hook-form)

Components from `@/components/ui/field`:

- `Field` - Wrapper with `data-invalid` for error styling
- `FieldGroup`, `FieldLabel`, `FieldError`, `FieldDescription`

Use with `Controller` from react-hook-form + Zod validation.

**Ref:** `components/ui/field.tsx`

### File Storage (MinIO)

1. Get presigned URL from `trpc.upload.getUploadUrl`
2. Upload directly to MinIO
3. Save reference in database

**Ref:** `module/upload/server/upload-router.ts`

## Conventions

- `@/` path alias for all imports
- `cn()` utility for styling (`@/lib/utils`)
- Icons from `lucide-react`
- Images in `assets/`, exported via `data/data.ts`
- Navigation in `constants/navigations.ts`
- Serbian for UI text, English for code/comments
- Admin pages use `requireAdmin()` from `@/module/auth/lib/auth-utils`
