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

### Key Patterns

**Module-based architecture**: Feature code lives in `module/` organized by domain (`public/home`, `admin`, `auth`). Components within modules use hierarchical naming relative to their parent folder.

**Component organization**:

- `components/ui/` contains shadcn components (do not manually edit)
- Feature components go in their respective `module/` subdirectory
- Use `@/` path alias for all imports

**Styling**: Tailwind CSS 4 with shadcn/ui. Theme uses CSS variables with OKLCH color space. Primary color is cyan-tinted. Custom radius tokens available (`rounded-4xl`).

**Forms**: Use `react-hook-form` for form handling.

**Icons**: Use `lucide-react` for icons.

### Admin Panel

Admin interfejs (`/admin`) omogućava upravljanje klinikom:

- **Kontrolna tabla** - Dashboard sa statistikama
- **Termini** - Pregled i upravljanje zakazanim terminima (potvrda, odbijanje, pomeranje)
- **Pacijenti** - Lista registrovanih pacijenata
- **Podešavanja** - Radno vreme, neradni dani, vrste usluga
- **Blog** - Upravljanje blog sadržajem (u izradi)

Sve admin stranice zahtevaju admin ulogu (`requireAdmin()` iz `@/module/auth/lib/auth-utils`).

Admin komponente koriste real-time Convex queries za automatsko osvežavanje podataka.

Navigacija je definisana u `constants/admin-navigation.ts`.

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
