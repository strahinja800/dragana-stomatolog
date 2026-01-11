'use client';

import Link from 'next/link';

import { type Preloaded, usePreloadedQuery } from 'convex/react';
import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type api } from '@/convex/_generated/api';

interface PatientsViewProps {
  preloadedPatientsQuery: Preloaded<typeof api.patients.getAllPatients>;
}

export function PatientsView({ preloadedPatientsQuery }: PatientsViewProps) {
  const patients = usePreloadedQuery(preloadedPatientsQuery);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pacijenti</h1>
        <p className="mt-1 text-muted-foreground">
          Pregled i upravljanje svim registrovanim pacijentima.
        </p>
      </div>

      {/* Patients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ime</TableHead>
              <TableHead>Prezime</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Nema registrovanih pacijenata.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell className="font-medium">
                    {patient.firstName}
                  </TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>{patient.email || '—'}</TableCell>
                  <TableCell>
                    {patient.isMain ? 'Glavni' : 'Sekundarni'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/patients/${patient._id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="ml-2">Pogledaj</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
