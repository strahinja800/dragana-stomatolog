'use client';

import Link from 'next/link';

import { type Preloaded, usePreloadedQuery } from 'convex/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type api } from '@/convex/_generated/api';
import { PatientAppointments } from '@/module/admin/patients/components/patient-appointments';
import { PatientBasicInfo } from '@/module/admin/patients/components/patient-basic-info';
import { PatientDetailsHeader } from '@/module/admin/patients/components/patient-details-header';
import { PatientSystemInfo } from '@/module/admin/patients/components/patient-system-info';

interface PatientDetailsViewProps {
  preloadedPatientQuery: Preloaded<
    typeof api.patients.getPatientWithAppointments
  >;
  preloadedMedicalRecordsQuery: Preloaded<
    typeof api.medicalRecords.getMedicalRecordsByPatientId
  >;
}

export function PatientDetailsView({
  preloadedPatientQuery,
  preloadedMedicalRecordsQuery,
}: PatientDetailsViewProps) {
  const data = usePreloadedQuery(preloadedPatientQuery);
  const allMedicalRecords = usePreloadedQuery(preloadedMedicalRecordsQuery);

  if (!data) return null;

  const { patient, appointments } = data;

  if (!patient) {
    return (
      <div className="space-y-8">
        <div>
          <Link href="/admin/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nazad na listu
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Pacijent nije pronađen</CardTitle>
            <CardDescription>
              Pacijent sa ovim ID-jem ne postoji u bazi.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PatientDetailsHeader patient={patient} />
      <PatientBasicInfo patient={patient} />
      <PatientSystemInfo patient={patient} />
      <PatientAppointments
        patient={patient}
        appointments={appointments}
        allMedicalRecords={allMedicalRecords}
      />
    </div>
  );
}
