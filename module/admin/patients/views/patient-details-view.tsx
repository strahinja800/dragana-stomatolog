'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Loader2 } from '@/constants/icons';
import { PatientAppointments } from '@/module/admin/patients/components/patient-appointments';
import { PatientBasicInfo } from '@/module/admin/patients/components/patient-basic-info';
import { PatientDetailsHeader } from '@/module/admin/patients/components/patient-details-header';
import { useTRPC } from '@/trpc/client';

interface PatientDetailsViewProps {
  patientId: string;
}

export function PatientDetailsView({ patientId }: PatientDetailsViewProps) {
  const t = useTranslations('admin.patients');
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
              {t('backToList')}
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('patientNotFound')}</CardTitle>
            <CardDescription>{t('patientNotFoundDescription')}</CardDescription>
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
      <PatientAppointments
        patient={patient}
        appointments={appointments}
        allMedicalRecords={medicalRecords}
      />
      <p className="text-center text-xs text-muted-foreground">
        ID: {patient.id}
      </p>
    </div>
  );
}
