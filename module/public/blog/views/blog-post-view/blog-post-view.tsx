'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import BlogPostViewContent from './blog-post-view-content';
import BlogPostViewHero from './blog-post-view-hero';

interface BlogPostViewProps {
  slug: string;
}

export function BlogPostView({ slug }: BlogPostViewProps) {
  const trpc = useTRPC();

  const { data: post } = useSuspenseQuery(
    trpc.blog.getPostBySlug.queryOptions({ slug })
  );

  return (
    <>
      <BlogPostViewHero post={post} />
      <BlogPostViewContent content={post.content} />
    </>
  );
}
