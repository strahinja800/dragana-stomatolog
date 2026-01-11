import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Doc } from '@/convex/_generated/dataModel';

interface PatientSystemInfoProps {
  patient: Doc<'patients'>;
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
            {patient._id}
          </p>
        </div>
        {patient.authId && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Auth ID</p>
            <p className="text-sm font-mono text-muted-foreground">
              {patient.authId}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
