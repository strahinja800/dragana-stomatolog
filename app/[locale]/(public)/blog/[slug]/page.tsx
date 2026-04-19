import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import {
  absoluteUrl,
  buildAlternates,
  buildOgImages,
  OG_LOCALE,
  SITE_URL,
} from '@/lib/seo';
import { BlogPostView } from '@/module/public/blog/views/blog-post-view/blog-post-view';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, featuredImage: true },
  });

  if (!post) {
    return { title: 'Članak nije pronađen' };
  }

  const title = post.title.replace(/<[^>]*>/g, '');
  const description = post.excerpt ?? undefined;

  return {
    title,
    description,
    alternates: buildAlternates(locale as 'sr' | 'en', `/blog/${slug}`),
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale as 'sr' | 'en', `/blog/${slug}`),
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'article' as const,
      images: buildOgImages(post.featuredImage),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, publishedAt: true, updatedAt: true },
  });

  if (!post) notFound();

  const pageUrl = absoluteUrl(locale as 'sr' | 'en', `/blog/${slug}`);
  const title = post.title.replace(/<[^>]*>/g, '');

  void prefetch(trpc.blog.getPostBySlug.queryOptions({ slug }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: title,
        description: post.excerpt ?? undefined,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        inLanguage: locale,
        publisher: { '@id': `${SITE_URL}/#business` },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        inLanguage: locale,
        about: { '@id': `${SITE_URL}/#business` },
      },
    ],
  };

  return (
    <HydrateClient>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostView slug={slug} />
    </HydrateClient>
  );
}
