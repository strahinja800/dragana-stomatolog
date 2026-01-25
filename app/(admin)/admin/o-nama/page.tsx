import { AboutAdminView } from '@/module/admin/about/views/about-admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function AboutAdminPage() {
  await requireAdmin('/admin/o-nama');

  return <AboutAdminView />;
}
