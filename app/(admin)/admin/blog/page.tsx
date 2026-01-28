import BlogAdminView from '@/module/admin/blog/views/blog-admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function BlogPage() {
  await requireAdmin('/admin/blog');

  return <BlogAdminView />;
}
