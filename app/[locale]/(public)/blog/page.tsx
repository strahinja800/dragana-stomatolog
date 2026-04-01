import { BlogView } from '@/module/public/blog/views/blog-view/blog-view';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function BlogPage() {
  void prefetch(trpc.blog.getPublishedPosts.queryOptions());

  return (
    <HydrateClient>
      <BlogView />
    </HydrateClient>
  );
}
