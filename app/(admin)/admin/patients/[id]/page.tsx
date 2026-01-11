import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';
import { preloadAuthQuery } from '@/lib/auth-server';
import { PatientDetailsView } from '@/module/admin/patients/views/patient-details-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

interface PatientDetailsPageProps {
  params: Promise<{ id: Id<'patients'> }>;
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  await requireAdmin('/admin/patients');
  const { id } = await params;

  const [patientQuery, medicalRecordsQuery] = await Promise.all([
    preloadAuthQuery(api.patients.getPatientWithAppointments, { id }),
    preloadAuthQuery(api.medicalRecords.getMedicalRecordsByPatientId, {
      patientId: id,
    }),
  ]);

  return (
    <PatientDetailsView
      preloadedPatientQuery={patientQuery}
      preloadedMedicalRecordsQuery={medicalRecordsQuery}
    />
  );
}
