import { UnderConstruction } from '@/module/admin/shared/components/under-construction/under-construction';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function BlogPage() {
  await requireAdmin('/admin/blog');

  return <UnderConstruction title="Blog" />;
}
