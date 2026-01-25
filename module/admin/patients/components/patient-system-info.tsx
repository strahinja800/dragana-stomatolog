import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PatientData } from '@/module/admin/patients/types/patient-types';

interface PatientSystemInfoProps {
  patient: PatientData;
}

export function PatientSystemInfo({ patient }: PatientSystemInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistemske informacije</CardTitle>
        <CardDescription>Tehnički podaci o nalogu</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            ID pacijenta
          </p>
          <p className="text-sm font-mono text-muted-foreground">
            {patient.id}
          </p>
        </div>
        {patient.userId && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="text-sm font-mono text-muted-foreground">
              {patient.userId}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
