import { requireAdmin } from '@/lib/auth-utils';
import { UsersView } from '@/module/admin/view/users-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

export default async function UsersPage() {
  await requireAdmin('/admin/korisnici');
  prefetch(trpc.hello.queryOptions());

  return (
    <HydrateClient>
      <UsersView />
    </HydrateClient>
  );
}
