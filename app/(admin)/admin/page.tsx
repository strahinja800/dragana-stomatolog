import { AdminView } from '@/module/admin/view/admin-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

export default function AdminPage() {
  prefetch(trpc.hello.queryOptions());

  return (
    <HydrateClient>
      <AdminView />
    </HydrateClient>
  );
}
