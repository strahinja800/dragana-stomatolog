'use client';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PatientAppointments } from '@/module/admin/patients/components/patient-appointments';
import { PatientBasicInfo } from '@/module/admin/patients/components/patient-basic-info';
import { PatientDetailsHeader } from '@/module/admin/patients/components/patient-details-header';
import { PatientSystemInfo } from '@/module/admin/patients/components/patient-system-info';
import { useTRPC } from '@/trpc/client';

interface PatientDetailsViewProps {
  patientId: string;
}

export function PatientDetailsView({ patientId }: PatientDetailsViewProps) {
  const trpc = useTRPC();

  const { data: patientData, isLoading: patientLoading } = useQuery(
    trpc.patient.getWithAppointments.queryOptions({ id: patientId })
  );

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!patientData) {
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

  const { appointments, medicalRecords, ...patient } = patientData;

  return (
    <div className="space-y-8">
      <PatientDetailsHeader patient={patient} />
      <PatientBasicInfo patient={patient} />
      <PatientSystemInfo patient={patient} />
      <PatientAppointments
        patient={patient}
        appointments={appointments}
        allMedicalRecords={medicalRecords}
      />
    </div>
  );
}
