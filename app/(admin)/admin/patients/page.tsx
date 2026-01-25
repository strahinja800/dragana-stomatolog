import { PatientsView } from '@/module/admin/patients/views/patients-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function PatientsPage() {
  await requireAdmin('/admin/patients');

  return <PatientsView />;
}
