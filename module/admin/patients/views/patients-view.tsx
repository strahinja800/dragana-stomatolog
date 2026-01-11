'use client';

import { useState } from 'react';
import Link from 'next/link';

import { type Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';
import { NewPatientDrawer } from '@/module/admin/patients/components/new-patient-drawer';

interface PatientsViewProps {
  preloadedPatientsQuery: Preloaded<typeof api.patients.getAllPatients>;
}

export function PatientsView({ preloadedPatientsQuery }: PatientsViewProps) {
  const patients = usePreloadedQuery(preloadedPatientsQuery);
  const [patientToDelete, setPatientToDelete] = useState<Id<'patients'> | null>(
    null
  );
  const deletePatient = useMutation(api.patients.deletePatient);

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient({ patientId: patientToDelete });
      setPatientToDelete(null);
      toast.success('Pacijent je uspešno obrisan');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Greška pri brisanju pacijenta';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacijenti</h1>
          <p className="mt-1 text-muted-foreground">
            Pregled i upravljanje svim registrovanim pacijentima.
          </p>
        </div>
        <NewPatientDrawer />
      </div>

      {/* Patients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ime</TableHead>
              <TableHead>Prezime</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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
                  <TableCell>{patient.phone || '—'}</TableCell>
                  <TableCell>
                    {patient.isMain ? 'Glavni' : 'Sekundarni'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/patients/${patient._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Pogledaj
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setPatientToDelete(patient._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Obriši
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!patientToDelete}
        onOpenChange={(open) => !open && setPatientToDelete(null)}
        onConfirm={confirmDelete}
        title="Potvrda brisanja"
        description="Da li ste sigurni da želite da obrišete ovog pacijenta? Ova akcija će obrisati i sve termine i medicinske zapise povezane sa ovim pacijentom. Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="destructive"
      />
    </div>
  );
}
