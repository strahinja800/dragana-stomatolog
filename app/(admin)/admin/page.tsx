import { requireAuth } from '@/lib/auth-utils';
import { AdminView } from '@/module/admin/view/admin-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

export default async function AdminPage() {
  await requireAuth('/admin');
  prefetch(trpc.hello.queryOptions());

  return (
    <HydrateClient>
      <AdminView />
    </HydrateClient>
  );
}
