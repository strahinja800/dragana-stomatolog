import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PatientData } from '@/module/admin/patients/types/patient-types';

interface PatientBasicInfoProps {
  patient: PatientData;
}

export function PatientBasicInfo({ patient }: PatientBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Osnovni podaci</CardTitle>
        <CardDescription>Lične informacije pacijenta</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Ime</p>
          <p className="text-base">{patient.firstName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Prezime</p>
          <p className="text-base">{patient.lastName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-base">{patient.email || '—'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Telefon</p>
          <p className="text-base">{patient.phone || '—'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Datum rođenja
          </p>
          <p className="text-base">
            {patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString('sr-RS')
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Pol</p>
          <p className="text-base">
            {patient.gender === 'MALE'
              ? 'Muški'
              : patient.gender === 'FEMALE'
                ? 'Ženski'
                : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Alergije</p>
          <p className="text-base">{patient.allergies || '—'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Terapija/Lekovi
          </p>
          <p className="text-base">{patient.medications || '—'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p className="text-base">
            {patient.isMain ? 'Glavni pacijent' : 'Sekundarni pacijent'}
          </p>
        </div>
        {patient.notes && (
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm font-medium text-muted-foreground">
              Napomene
            </p>
            <p className="text-base">{patient.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
