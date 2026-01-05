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

## Architecture

### Directory Structure

```
app/                    # Next.js App Router
  (public)/             # Route group for public pages
    layout.tsx          # Public layout with navbar
    page.tsx            # Home page
  (admin)/              # Route group for admin pages
    admin/              # Admin dashboard pages
  api/auth/             # Better Auth API routes
  layout.tsx            # Root layout (fonts, metadata)
  globals.css           # Tailwind + shadcn theme (OKLCH colors)

convex/                 # Convex backend
  _generated/           # Auto-generated Convex types
  betterAuth/           # Better Auth adapter for Convex
  schema.ts             # Database schema definition
  settings.ts           # Clinic settings queries/mutations
  appointments.ts       # Appointment queries/mutations
  patients.ts           # Patient queries/mutations
  users.ts              # User queries/mutations
  auth.ts               # Auth configuration

module/                 # Feature modules (domain-driven structure)
  public/
    home/components/    # Home page components
    shared/components/  # Shared public components (navbar, footer)
  admin/
    components/         # Admin dashboard components
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

### Key Patterns

**Module-based architecture**: Feature code lives in `module/` organized by domain (`public/home`, `admin`, `auth`). Components within modules use hierarchical naming relative to their parent folder.

**Component organization**:

- `components/ui/` contains shadcn components (do not manually edit)
- Feature components go in their respective `module/` subdirectory
- Use `@/` path alias for all imports

**Styling**: Tailwind CSS 4 with shadcn/ui. Theme uses CSS variables with OKLCH color space. Primary color is cyan-tinted. Custom radius tokens available (`rounded-4xl`).

**Forms**: Use `react-hook-form` for form handling.

**Icons**: Use `lucide-react` for icons.

**Backend-first logika**: Sva transformacija, normalizacija i priprema podataka mora biti u Convex funkcijama, a ne na frontendu. Frontend komponente treba da dobiju podatke "spremne za upotrebu" bez dodatne obrade.

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

**Data Fetching (Convex)**: Za komponente koje zahtevaju podatke sa servera, koristi Convex hookove:

1. **Queries** - za čitanje podataka (real-time by default):

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

2. **Mutations** - za izmenu podataka:

   ```tsx
   'use client';
   import { useMutation } from 'convex/react';
   import { api } from '@/convex/_generated/api';

   export default function MyComponent() {
     const updateData = useMutation(api.myModule.myMutation);

     const handleSubmit = async () => {
       await updateData({ field: 'value' });
     };
   }
   ```

3. **Convex functions** (`convex/*.ts`):

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

## Stack

- Next.js 16.1.0 (App Router, React Server Components)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4 with `@tailwindcss/postcss`
- shadcn/ui (radix-vega style, RSC-compatible)
- Convex (serverless backend with real-time sync)
- Better Auth (authentication with Convex adapter)
- react-hook-form for forms
- date-fns for date utilities
- lucide-react for icons

## Conventions

- Serbian language for all UI text
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Static images go in `assets/` and are exported from `data/data.ts`
- Navigation links defined in `constants/navigations.ts`
- Convex functions organized by domain in `convex/` folder
