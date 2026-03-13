'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLink, User, Users } from '@/constants/icons';

interface RecentPatient {
  id: string;
  name: string;
  registeredAt: string;
  phone: string;
}

const PLACEHOLDER_PATIENTS: RecentPatient[] = [
  { id: '1', name: 'Jovana Milić', registeredAt: '13. mar 2026.', phone: '063 123 456' },
  { id: '2', name: 'Dragan Vasić', registeredAt: '12. mar 2026.', phone: '064 987 654' },
  { id: '3', name: 'Ivana Todorović', registeredAt: '11. mar 2026.', phone: '065 555 111' },
  { id: '4', name: 'Milan Kostić', registeredAt: '10. mar 2026.', phone: '060 222 333' },
  { id: '5', name: 'Tamara Lukić', registeredAt: '9. mar 2026.', phone: '066 444 777' },
];

export function DashboardRecentPatients() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="size-5 text-emerald-500" />
          Skorašnji pacijenti
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/50">
          {PLACEHOLDER_PATIENTS.map((patient) => (
            <li
              key={patient.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <User className="size-4 text-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{patient.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {patient.phone} · {patient.registeredAt}
                </p>
              </div>
              <button className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
                <ExternalLink className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
