'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import BlogViewGrid from './blog-view-grid';
import BlogViewHero from './blog-view-hero';

export function BlogView() {
  const trpc = useTRPC();

  const { data: posts } = useSuspenseQuery(
    trpc.blog.getPublishedPosts.queryOptions()
  );

  return (
    <>
      <BlogViewHero />
      <BlogViewGrid posts={posts} />
    </>
  );
}
