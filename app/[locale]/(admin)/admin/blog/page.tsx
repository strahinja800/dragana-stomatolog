import BlogAdminView from '@/module/admin/blog/views/blog-admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default async function BlogPage() {
  await requireAdmin('/admin/blog');

  void prefetch(trpc.blog.getAllPosts.queryOptions());

  return (
    <HydrateClient>
      <BlogAdminView />
    </HydrateClient>
  );
}
