# Copilot Instructions

Guidelines for AI coding assistants working on the DentalCare dental clinic website.

## Architecture

**Module-based structure**: Features organized in [module/public/](../module/public/) by domain (home, services, shared). Route groups in [app/(public)/](<../app/(public)/>) for public pages. Server Components by default; use `'use client'` only when needed (forms, interactivity).

**Component hierarchy**: Decompose large components into focused sub-components. Group in a folder with hierarchical naming:

```
module/public/home/components/
  hero/
    booking-form.tsx              # Main component
    booking-form-fields.tsx       # Child component
    booking-form-submit.tsx       # Child component
```

**Data management**: Static content (services, team, testimonials) exports from [data/data.ts](../data/data.ts). Images imported from [assets/](../assets/) using Next.js Image. Navigation links in [constants/navigations.ts](../constants/navigations.ts).

## Development Workflow

```bash
npm run dev         # Start Next.js dev server (localhost:3000)
npm run convex      # Start Convex dev server (run in separate terminal)
npm run validate    # Run format, lint, and type-check (do this before commits)
tsc --noEmit        # Type-check only (run before suggesting code changes)
```

**TypeScript-first**: All code must be strictly typed. Run `tsc --noEmit` before suggesting changes. Never use `any` or type assertions without justification.

**Import order**: Write usage FIRST, then add imports SECOND. This prevents auto-removal of unused imports during editing.

## Tech Stack

### Frontend

- **Next.js 16.1.0** with App Router and React Server Components
- **React 19.2.3** with hooks (react-hook-form for forms)
- **Tailwind CSS 4** with shadcn/ui (radix-vega style)
- **TypeScript 5** with strict mode

### Backend

- **Convex** - Serverless backend with real-time sync
- **Better Auth** - Authentication with Convex adapter

### Convex Patterns

**Queries** (read data, real-time by default):

```tsx
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function MyComponent() {
  const data = useQuery(api.myModule.myQuery);
  if (data === undefined) return <Loading />;
  // render data
}
```

**Mutations** (write data):

```tsx
'use client';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function MyComponent() {
  const updateData = useMutation(api.myModule.myMutation);
  const handleClick = () => updateData({ field: 'value' });
}
```

**Backend functions** (`convex/*.ts`):

```ts
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const myQuery = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('myTable').collect();
  },
});

export const myMutation = mutation({
  args: { field: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('myTable', { field: args.field });
  },
});
```

## Code Conventions

**Path aliases**: Always use `@/` for imports (e.g., `import { Button } from '@/components/ui/button'`)

**Styling**: Use `cn()` utility from `@/lib/utils` for conditional classes:

```tsx
<div className={cn('base-classes', condition && 'conditional-classes')} />
```

**Forms**: Use react-hook-form with TypeScript interfaces:

```tsx
interface FormData {
  name: string;
  phone: string;
}
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>();
```

**Icons**: Import from lucide-react (e.g., `import { Calendar, Phone } from 'lucide-react'`)

**Language**: Serbian for UI text and user-facing content. English for code, comments, and commit messages.

## Critical Patterns

**Minimalism**: Implement only what's needed. No unused code, placeholders, or commented-out blocks. Keep the codebase lean.

**Backend-first logic**: All data transformation/normalization happens in Convex functions, not frontend components.

**Component atomicity**: Break complex components into smaller pieces. Each file should have a single, focused responsibility.

**shadcn components**: Located in [components/ui/](../components/ui/). Do not manually edit - regenerate via shadcn CLI if changes needed.

**Figma assets**: When importing from Figma, rename hash/random filenames to semantic names (e.g., `hero-bg.png` instead of `vector_12ab.svg`).

See [README.md](../README.md) for detailed project overview and [AGENTS.md](../AGENTS.md) for extended AI agent guidelines.
