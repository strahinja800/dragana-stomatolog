import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PatientData } from '@/module/admin/patients/types/patient-types';

interface PatientDetailsHeaderProps {
  patient: PatientData;
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
  return (
    <div>
      <Link href="/admin/patients">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Nazad na listu
        </Button>
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        {patient.firstName} {patient.lastName}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Detaljne informacije o pacijentu
      </p>
    </div>
  );
}
