import { requireAdmin } from '@/module/auth/lib/auth-utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

import { AppointmentsView } from './appointments-view';

export const metadata = {
  title: 'Termini | Admin',
};

export default async function AppointmentsPage() {
  await requireAdmin('/admin/termini');

  prefetch(trpc.appointment.getAllAppointments.queryOptions({}));
  prefetch(trpc.settings.getServiceTypes.queryOptions());

  return (
    <HydrateClient>
      <AppointmentsView />
    </HydrateClient>
  );
}
