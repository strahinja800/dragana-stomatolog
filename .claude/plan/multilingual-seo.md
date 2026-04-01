# Implementation Plan: Multilingual SEO & Metadata

## Summary

Implement complete SEO infrastructure for the multilingual dental clinic website (sr/en). Currently the site has zero SEO setup beyond a static metadata export. This plan adds: translated metadata per page, hreflang alternate links, sitemap with hreflang, robots.txt, Open Graph tags, JSON-LD structured data (Dentist schema), and routing config hardening for Google indexing.

**Key goal:** English pages must appear in Google search results for English-speaking users (medical tourism potential).

## Task Type
- [x] Frontend (metadata, JSON-LD, OG tags)
- [ ] Backend
- [x] Fullstack (routing config, sitemap, robots)

## Current State

- next-intl v4.8.3 with `sr` (default) and `en` locales
- Routes: `/[locale]/(public)/...` - same paths for both locales (no localized pathnames)
- Static `metadata` export in layout - NOT locale-aware
- Blog posts have dynamic `generateMetadata` but no alternates/OG
- `<html lang={locale}>` correctly set
- Middleware excludes `sitemap.xml` and `robots.txt` from i18n
- **Missing:** sitemap, robots.txt, hreflang, canonical URLs, OG tags, JSON-LD, locale-aware metadata

## Technical Solution

**Synthesized from Codex + research agents:**

1. **Routing config:** Set `localePrefix: 'always'`, `localeDetection: false`, `alternateLinks: false` - prevents SEO issues from auto-redirects, ensures both `/sr/` and `/en/` are always crawlable
2. **SEO helper module:** Shared `absoluteUrl()` + `buildAlternates()` used by both `generateMetadata` and `sitemap.ts`
3. **Navigation module:** Create `i18n/navigation.ts` with `createNavigation(routing)` for `getPathname`
4. **Per-page metadata:** Replace static `metadata` with `generateMetadata` using `getTranslations`
5. **Sitemap:** `app/sitemap.ts` with hreflang alternates for all public routes + dynamic blog posts
6. **robots.txt:** `app/robots.ts` blocking admin/api, linking sitemap
7. **JSON-LD:** `Dentist` + `WebPage` structured data on homepage
8. **OG tags:** Locale-specific og:locale, translated og:title/description

## Implementation Steps

### Step 1: Harden routing config
**File:** `i18n/routing.ts` (MODIFY)
**Deliverable:** Add `localePrefix`, `localeDetection`, `alternateLinks` options

```ts
export const routing = defineRouting({
  locales: ['sr', 'en'],
  defaultLocale: 'sr',
  localePrefix: 'always',
  localeDetection: false,
  alternateLinks: false,
});
```

**Why:**
- `localePrefix: 'always'` - ensures `/sr/` is always in URL, prevents duplicate content (bare `/` vs `/sr/`)
- `localeDetection: false` - Googlebot crawls without Accept-Language, auto-detection hides content from bots
- `alternateLinks: false` - we'll manage hreflang via metadata API + sitemap instead of middleware headers

### Step 2: Create navigation module
**File:** `i18n/navigation.ts` (NEW)
**Deliverable:** Export `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### Step 3: Create SEO helper module
**File:** `lib/seo.ts` (NEW)
**Deliverable:** `absoluteUrl()`, `buildAlternates()`, `SITE_URL` constant

```ts
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dentalholist.rs';

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}/${locale}${path === '/' ? '' : path}`;
}

export function buildAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(loc, path);
  }
  languages['x-default'] = `${SITE_URL}${path === '/' ? '' : path}`;

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}
```

### Step 4: Add Metadata translations
**Files:** `messages/sr.json`, `messages/en.json` (MODIFY)
**Deliverable:** New `Metadata` namespace with per-page title/description

Keys needed:
```json
{
  "Metadata": {
    "siteTitle": "DENTALHOLIST KONCEPT",
    "home": {
      "title": "DENTALHOLIST KONCEPT | Premium Stomatološka Ordinacija",
      "description": "Premium holistički pristup stomatologiji. Online zakazivanje, podsetnici i savremena nega osmeha."
    },
    "services": {
      "title": "Naše usluge",
      "description": "Kompletna stomatološka nega - od preventive do estetske stomatologije."
    },
    "about": {
      "title": "O nama",
      "description": "Upoznajte naš tim i holistički pristup stomatologiji."
    },
    "contact": {
      "title": "Kontakt",
      "description": "Zakažite pregled ili nas kontaktirajte za više informacija."
    },
    "blog": {
      "title": "Blog",
      "description": "Saveti i novosti iz sveta stomatologije."
    },
    "results": {
      "title": "Rezultati",
      "description": "Pogledajte rezultate naših tretmana."
    },
    "structuredData": {
      "businessDescription": "Premium holistička stomatološka ordinacija u Beogradu."
    }
  }
}
```

English version with translated values.

### Step 5: Replace static metadata in layout with generateMetadata
**File:** `app/[locale]/layout.tsx` (MODIFY)
**Deliverable:** Dynamic `generateMetadata` with title template, metadataBase, OG defaults

```ts
import { getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('home.title'),
      template: `%s | ${t('siteTitle')}`,
    },
    description: t('home.description'),
  };
}
```

Remove the existing static `export const metadata`.

### Step 6: Add generateMetadata to each public page
**Files:** All public page.tsx files (MODIFY)
**Deliverable:** Per-page `generateMetadata` with translated title, description, alternates, and OG

Pages to update:
- `app/[locale]/(public)/page.tsx` - Home
- `app/[locale]/(public)/usluge/page.tsx` - Services
- `app/[locale]/(public)/o-nama/page.tsx` - About
- `app/[locale]/(public)/kontakt/page.tsx` - Contact
- `app/[locale]/(public)/blog/page.tsx` - Blog listing
- `app/[locale]/(public)/blog/[slug]/page.tsx` - Blog post (enhance existing)
- `app/[locale]/(public)/rezultati/page.tsx` - Results

Pattern for each page:
```ts
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/lib/seo';

const OG_LOCALE = { sr: 'sr_RS', en: 'en_US' } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.services' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates(locale as 'sr' | 'en', '/usluge'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'website',
    },
  };
}
```

Blog post page: enhance existing `generateMetadata` to include `alternates` and `openGraph`.

### Step 7: Create robots.ts
**File:** `app/robots.ts` (NEW)
**Deliverable:** robots.txt blocking admin/api, referencing sitemap

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

### Step 8: Create sitemap.ts
**File:** `app/sitemap.ts` (NEW)
**Deliverable:** Multilingual sitemap with hreflang alternates for all public routes + dynamic blog posts

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl, SITE_URL } from '@/lib/seo';
import { prisma } from '@/lib/prisma';

const staticRoutes = ['/', '/usluge', '/o-nama', '/kontakt', '/blog', '/rezultati'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const path of staticRoutes) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = absoluteUrl(locale, path);
    }

    entries.push({
      url: absoluteUrl(routing.defaultLocale, path),
      lastModified: new Date(),
      alternates: { languages },
    });
  }

  // Dynamic blog posts
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = absoluteUrl(locale, path);
    }

    entries.push({
      url: absoluteUrl(routing.defaultLocale, path),
      lastModified: post.updatedAt,
      alternates: { languages },
    });
  }

  return entries;
}
```

### Step 9: Add JSON-LD structured data to homepage
**File:** `app/[locale]/(public)/page.tsx` or create `lib/json-ld.ts` helper (MODIFY/NEW)
**Deliverable:** `Dentist` + `WebPage` schema.org markup

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dentist',
      '@id': `${SITE_URL}/#business`,
      name: 'DENTALHOLIST KONCEPT',
      description: t('structuredData.businessDescription'),
      url: absoluteUrl(locale, '/'),
      telephone: '+381...', // actual phone
      address: {
        '@type': 'PostalAddress',
        streetAddress: '...', // actual address
        addressLocality: 'Beograd',
        postalCode: '...',
        addressCountry: 'RS',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+381...',
        contactType: 'customer service',
        availableLanguage: ['sr', 'en'],
      },
      knowsLanguage: ['sr', 'en'],
    },
    {
      '@type': 'WebPage',
      '@id': `${absoluteUrl(locale, '/')}#webpage`,
      url: absoluteUrl(locale, '/'),
      name: t('home.title'),
      inLanguage: locale,
      about: { '@id': `${SITE_URL}/#business` },
    },
  ],
};
```

Render as `<script type="application/ld+json">` with sanitized JSON.

### Step 10: Add NEXT_PUBLIC_SITE_URL env variable
**File:** `.env` / `.env.local` (MODIFY)
**Deliverable:** `NEXT_PUBLIC_SITE_URL=https://dentalholist.rs`

Also add to deployment environment (Vercel, etc.).

### Step 11: Verification
- `tsc --noEmit` - type check
- `npm run build` - ensure all metadata routes generate correctly
- Manual checks:
  1. Visit `/sitemap.xml` - verify hreflang entries for both locales
  2. Visit `/robots.txt` - verify sitemap reference, admin blocked
  3. View page source on `/sr` and `/en` - verify different title/description
  4. Check `<link rel="canonical">` and `<link rel="alternate" hreflang="...">` tags
  5. Check `<meta property="og:locale">` tags
  6. Check JSON-LD with Google Rich Results Test
  7. Verify `/sr/usluge` and `/en/usluge` both resolve (no redirect loop)

### Post-deploy: Google Search Console
- Verify domain property
- Submit sitemap URL
- Inspect `/sr/` and `/en/` URLs
- Monitor indexing status for both locales

## Key Files

| File | Operation | Description |
|------|-----------|-------------|
| i18n/routing.ts | Modify | Add localePrefix, localeDetection, alternateLinks |
| i18n/navigation.ts | Create | Navigation helpers with createNavigation |
| lib/seo.ts | Create | absoluteUrl, buildAlternates helpers |
| messages/sr.json | Modify | Add Metadata namespace |
| messages/en.json | Modify | Add Metadata namespace |
| app/[locale]/layout.tsx | Modify | Replace static metadata with generateMetadata |
| app/[locale]/(public)/page.tsx | Modify | Add generateMetadata + JSON-LD |
| app/[locale]/(public)/usluge/page.tsx | Modify | Add generateMetadata |
| app/[locale]/(public)/o-nama/page.tsx | Modify | Add generateMetadata |
| app/[locale]/(public)/kontakt/page.tsx | Modify | Add generateMetadata |
| app/[locale]/(public)/blog/page.tsx | Modify | Add generateMetadata |
| app/[locale]/(public)/blog/[slug]/page.tsx | Modify | Enhance with alternates + OG |
| app/[locale]/(public)/rezultati/page.tsx | Modify | Add generateMetadata |
| app/robots.ts | Create | robots.txt generation |
| app/sitemap.ts | Create | Multilingual sitemap with hreflang |

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| `localeDetection: false` breaks existing UX | Bare `/` still redirects to `/sr/` via middleware default behavior |
| Blog posts don't have per-locale content | Same slug/content served for both locales - acceptable for now, can add translations later |
| Missing actual clinic address/phone for JSON-LD | Use placeholder, update with real data before deploy |
| SITE_URL not set in env | Fallback to hardcoded domain in lib/seo.ts |
| Static routes list in sitemap gets stale | Keep centralized in sitemap.ts, update when adding new public pages |

## Assumptions
- Blog posts are NOT translated (same content for both locales) - hreflang still valid
- Route paths are NOT localized (same `/usluge` for both sr and en)
- Clinic physical address and phone number to be provided for JSON-LD
- Production domain is known (for SITE_URL)

## SESSION_ID (for /ccg:execute use)
- CODEX_SESSION: (from codeagent-wrapper output)
- GEMINI_SESSION: N/A
