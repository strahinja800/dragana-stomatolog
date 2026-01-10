import { AdminView } from '@/module/admin/dashboard/views/admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function AdminPage() {
  await requireAdmin('/admin');

  return <AdminView />;
}
