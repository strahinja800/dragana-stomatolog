import { requireAdmin } from '@/module/auth/lib/auth-utils';

import { AppointmentsView } from './appointments-view';

export const metadata = {
  title: 'Termini | Admin',
};

export default async function AppointmentsPage() {
  await requireAdmin('/admin/termini');

  return <AppointmentsView />;
}
