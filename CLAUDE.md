# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
  (admin)/              # Route group for admin pages
    admin/
      page.tsx          # Dashboard
      termini/page.tsx  # Appointments management
      patients/page.tsx # Patients list
      podesavanja/page.tsx # Settings
      blog/page.tsx     # Blog management
  api/auth/             # Better Auth API routes
  layout.tsx            # Root layout
  globals.css           # Tailwind + shadcn theme (OKLCH colors)

convex/                 # Convex backend
  _generated/           # Auto-generated Convex types
  betterAuth/           # Better Auth component
  lib/timezone.ts       # Serbia timezone utilities (Europe/Belgrade)
  schema.ts             # Database schema
  settings.ts           # Clinic settings
  appointments.ts       # Appointment booking
  patients.ts           # Patient management

module/                 # Feature modules (domain-driven)
  public/               # Public-facing components
  admin/                # Admin panel components
  auth/                 # Auth forms

components/
  ui/                   # shadcn/ui components
  providers/            # React context providers

lib/
  utils.ts              # Utility functions (cn helper)
  auth-client.ts        # Better Auth client
  auth-server.ts        # Better Auth server
```

## Code Conventions

- Use `@/` path alias for all imports
- Styling with `cn()` utility from `@/lib/utils`
- Forms with `react-hook-form`
- Icons from `lucide-react`
- Feature components go in `module/` organized by domain
- Serbian for UI text, English for code and comments

## Backend (Convex)

- **Schema**: Define tables in `convex/schema.ts`
- **Queries**: Use `query()` for read operations (real-time by default)
- **Mutations**: Use `mutation()` for write operations
- **Backend-first logic**: All data transformation happens in Convex functions, not frontend
- **Timezone**: Use `convex/lib/timezone.ts` for Serbia timezone (Europe/Belgrade)

### Data Fetching

**Preloaded Queries** (preferred):
```tsx
// Server Component
const preloadedData = await preloadQuery(api.myModule.myQuery);
return <MyView preloadedData={preloadedData} />;

// Client Component
const data = usePreloadedQuery(preloadedData);
```

**useQuery** (wrap in Suspense):
```tsx
<Suspense fallback={<Loading />}>
  <ComponentWithUseQuery />
</Suspense>
```

**Mutations** (with TanStack Query):
```tsx
const mutationFn = useConvexMutation(api.myModule.myMutation);
const { mutate, isPending } = useMutation({
  mutationFn,
  onSuccess: () => toast.success('Saved'),
  onError: (error) => toast.error(error.message),
});
```

## Admin Module

- **Views**: `module/admin/{domain}/views/`
- **Components**: `module/admin/{domain}/components/`
- **Protection**: Use `requireAdmin()` from `@/module/auth/lib/auth-utils`
- **Navigation**: Defined in `constants/admin-navigation.ts`

## Quality Guidelines

1. Always apply TypeScript types. Run `tsc --noEmit` before changes.
2. Decompose large components into smaller, focused sub-components.
3. Implement only what is needed. Avoid unused or speculative code.
4. Include error handling and edge cases.
5. Backend-first: all data transformation in Convex, not frontend.
