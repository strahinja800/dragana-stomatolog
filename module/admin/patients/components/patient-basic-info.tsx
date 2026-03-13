import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LucideIcon } from '@/constants/icons';
import {
  AlertCircle,
  Calendar,
  FileText,
  Mail,
  Phone,
  Pill,
  ShieldCheck,
  User,
  Users,
} from '@/constants/icons';
import type { PatientData } from '@/module/admin/patients/types/patient-types';

interface PatientBasicInfoProps {
  patient: PatientData;
}

function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function PatientBasicInfo({ patient }: PatientBasicInfoProps) {
  const genderLabel =
    patient.gender === 'MALE'
      ? 'Muški'
      : patient.gender === 'FEMALE'
        ? 'Ženski'
        : null;

  const dateOfBirthLabel = patient.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString('sr-RS')
    : null;

  const statusLabel = patient.isMain
    ? 'Glavni pacijent'
    : 'Sekundarni pacijent';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Osnovni podaci</CardTitle>
        <CardDescription>Lične informacije pacijenta</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <InfoField icon={User} label="Ime" value={patient.firstName} />
        <InfoField icon={User} label="Prezime" value={patient.lastName} />
        {patient.email && (
          <InfoField icon={Mail} label="Email" value={patient.email} />
        )}
        {patient.phone && (
          <InfoField icon={Phone} label="Telefon" value={patient.phone} />
        )}
        {dateOfBirthLabel && (
          <InfoField
            icon={Calendar}
            label="Datum rođenja"
            value={dateOfBirthLabel}
          />
        )}
        {genderLabel && (
          <InfoField icon={Users} label="Pol" value={genderLabel} />
        )}
        {patient.allergies && (
          <InfoField
            icon={AlertCircle}
            label="Alergije"
            value={patient.allergies}
          />
        )}
        {patient.medications && (
          <InfoField
            icon={Pill}
            label="Terapija/Lekovi"
            value={patient.medications}
          />
        )}
        <InfoField icon={ShieldCheck} label="Status" value={statusLabel} />
        {patient.notes && (
          <div className="md:col-span-2">
            <InfoField icon={FileText} label="Napomene" value={patient.notes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
