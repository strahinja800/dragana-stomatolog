import { AdminView } from '@/module/admin/view/admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';

export default async function AdminPage() {
  await requireAdmin('/admin');

  return (
    <HydrateClient>
      <AdminView />
    </HydrateClient>
  );
}
