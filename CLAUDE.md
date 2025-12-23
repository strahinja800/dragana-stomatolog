# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A dental clinic website ("DentalCare") built with Next.js 16, React 19, and Tailwind CSS 4. The project is currently being refactored from Lovable to Next.js. Serbian language is used for all user-facing content.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
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
  layout.tsx            # Root layout (fonts, metadata)
  globals.css           # Tailwind + shadcn theme (OKLCH colors)

module/                 # Feature modules (domain-driven structure)
  public/
    home/components/    # Home page components
    shared/components/  # Shared public components (navbar, footer)

components/ui/          # shadcn/ui components (radix-vega style)
constants/              # App-wide constants (navigation links)
data/                   # Static data exports (services, team, testimonials)
assets/                 # Static images (imported via Next.js Image)
lib/utils.ts            # Utility functions (cn helper)
hooks/                  # Custom React hooks
```

### Key Patterns

**Module-based architecture**: Feature code lives in `module/` organized by domain (`public/home`, `public/shared`). Components within modules use hierarchical naming relative to their parent folder.

**Component organization**:

- `components/ui/` contains shadcn components (do not manually edit)
- Feature components go in their respective `module/` subdirectory
- Use `@/` path alias for all imports

**Styling**: Tailwind CSS 4 with shadcn/ui. Theme uses CSS variables with OKLCH color space. Primary color is cyan-tinted. Custom radius tokens available (`rounded-4xl`).

**Forms**: Use `react-hook-form` for form handling.

**Icons**: Use `lucide-react` for icons.

## Stack

- Next.js 16.1.0 (App Router, React Server Components)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4 with `@tailwindcss/postcss`
- shadcn/ui (radix-vega style, RSC-compatible)
- react-hook-form for forms
- date-fns for date utilities
- lucide-react for icons

## Conventions

- Serbian language for all UI text
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Static images go in `assets/` and are exported from `data/data.ts`
- Navigation links defined in `constants/navigations.ts`
