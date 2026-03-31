import { PatientDetailsView } from '@/module/admin/patients/views/patient-details-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

interface PatientDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  await requireAdmin('/admin/patients');
  const { id } = await params;

  return <PatientDetailsView patientId={id} />;
}
