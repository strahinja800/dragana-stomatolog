import { api } from '@/convex/_generated/api';
import { preloadAuthQuery } from '@/lib/auth-server';
import { PatientsView } from '@/module/admin/patients/views/patients-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function PatientsPage() {
  await requireAdmin('/admin/patients');

  const [patientsQuery] = await Promise.all([
    preloadAuthQuery(api.patients.getAllPatients),
  ]);

  return <PatientsView preloadedPatientsQuery={patientsQuery} />;
}
