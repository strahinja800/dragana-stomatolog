import { AdminView } from '@/module/admin/dashboard/views/admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default async function AdminPage() {
  await requireAdmin('/admin');
  void prefetch(trpc.appointment.getToday.queryOptions());
  void prefetch(trpc.appointment.getPending.queryOptions());
  void prefetch(trpc.patient.getStats.queryOptions());

  return (
    <HydrateClient>
      <AdminView />;
    </HydrateClient>
  );
}
