'use client';

import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { type Preloaded, usePreloadedQuery } from 'convex/react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';
import { NewPatientDrawer } from '@/module/admin/patients/components/new-patient-drawer';
import { PatientsTable } from '@/module/admin/patients/components/patients-table/patients-table';

interface PatientsViewProps {
  preloadedPatientsQuery: Preloaded<typeof api.patients.getAllPatients>;
}

export function PatientsView({ preloadedPatientsQuery }: PatientsViewProps) {
  const patients = usePreloadedQuery(preloadedPatientsQuery);
  const [patientToDelete, setPatientToDelete] = useState<Id<'patients'> | null>(
    null
  );

  const deletePatientFn = useConvexMutation(api.patients.deletePatient);
  const { mutate: deletePatient } = useMutation({
    mutationFn: deletePatientFn,
    onSuccess: () => {
      setPatientToDelete(null);
      toast.success('Pacijent je uspešno obrisan');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Greška pri brisanju pacijenta';
      toast.error(message);
    },
  });

  const confirmDelete = () => {
    if (!patientToDelete) return;
    deletePatient({ patientId: patientToDelete });
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
      <PatientsTable data={patients} onDeletePatient={setPatientToDelete} />

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
