import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { AppointmentsView } from '@/module/admin/termini/views/appointments-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export const metadata = {
  title: 'Termini | Admin',
};

export default async function AppointmentsPage() {
  await requireAdmin('/admin/termini');

  const preloadedAppointments = await preloadQuery(
    api.appointments.getAllAppointments,
    {}
  );

  return <AppointmentsView preloadedAppointments={preloadedAppointments} />;
}
