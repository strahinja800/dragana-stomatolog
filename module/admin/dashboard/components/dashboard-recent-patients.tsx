'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, User, Users } from '@/constants/icons';
import { useTRPC } from '@/trpc/client';

export function DashboardRecentPatients() {
  const trpc = useTRPC();
  const { data: patients } = useSuspenseQuery(
    trpc.patient.getRecent.queryOptions()
  );

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <Users className="size-5 text-emerald-500" />
            Skorašnji pacijenti
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
            asChild
          >
            <Link href="/admin/patients">
              <ExternalLink className="size-3.5" />
              Svi pacijenti
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/50">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <User className="size-4 text-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {patient.phone ?? 'Bez broja'} ·{' '}
                  {format(new Date(patient.createdAt), 'd. MMM yyyy.', {
                    locale: sr,
                  })}
                </p>
              </div>
              <Link
                href={`/admin/patients/${patient.id}`}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                title="Otvori profil"
              >
                <ExternalLink className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
