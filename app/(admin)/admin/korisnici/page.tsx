import { UsersView } from '@/module/admin/view/users-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';

export default async function UsersPage() {
  await requireAdmin('/admin/korisnici');

  return (
    <HydrateClient>
      <UsersView />
    </HydrateClient>
  );
}
