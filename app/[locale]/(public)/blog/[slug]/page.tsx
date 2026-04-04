import { prisma } from '@/lib/prisma';
import { buildAlternates } from '@/lib/seo';
import { BlogPostView } from '@/module/public/blog/views/blog-post-view/blog-post-view';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const OG_LOCALE = { sr: 'sr_RS', en: 'en_US' } as const;

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
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
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: locale === 'sr' ? ['en_US'] : ['sr_RS'],
      type: 'article' as const,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  void prefetch(trpc.blog.getPostBySlug.queryOptions({ slug }));

  return (
    <HydrateClient>
      <BlogPostView slug={slug} />
    </HydrateClient>
  );
}
