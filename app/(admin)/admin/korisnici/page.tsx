import { UsersView } from '@/module/admin/view/users-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function UsersPage() {
  await requireAdmin('/admin/korisnici');

  return <UsersView />;
}
