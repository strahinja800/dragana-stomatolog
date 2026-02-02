import { prisma } from '@/lib/prisma';
import { BlogPostView } from '@/module/public/blog/views/blog-post-view/blog-post-view';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!post) {
    return { title: 'Članak nije pronađen' };
  }

  return {
    title: post.title.replace(/<[^>]*>/g, ''),
    description: post.excerpt ?? undefined,
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
