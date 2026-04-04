import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo';
import { prisma } from '@/lib/prisma';

const staticRoutes = ['/', '/usluge', '/o-nama', '/kontakt', '/blog', '/rezultati'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

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

  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
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
