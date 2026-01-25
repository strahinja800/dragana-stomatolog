'use client';

import { useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { NewPatientDrawer } from '@/module/admin/patients/components/new-patient-drawer';
import { PatientsTable } from '@/module/admin/patients/components/patients-table/patients-table';
import { useTRPC } from '@/trpc/client';

export function PatientsView() {
  const trpc = useTRPC();
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const { data: patientsData, refetch } = useQuery(
    trpc.patient.getAll.queryOptions({})
  );

  const deletePatientMutation = useMutation(
    trpc.patient.delete.mutationOptions({
      onSuccess: () => {
        setPatientToDelete(null);
        toast.success('Pacijent je uspešno obrisan');
        refetch();
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Greška pri brisanju pacijenta';
        toast.error(message);
      },
    })
  );

  const confirmDelete = () => {
    if (!patientToDelete) return;
    deletePatientMutation.mutate({ id: patientToDelete });
  };

  const patients = patientsData?.patients ?? [];

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
