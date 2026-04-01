'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { NewPatientDrawer } from '@/module/admin/patients/components/new-patient-drawer';
import { PatientsTable } from '@/module/admin/patients/components/patients-table/patients-table';
import { useTRPC } from '@/trpc/client';

export function PatientsView() {
  const t = useTranslations('admin.patients');
  const trpc = useTRPC();
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const { data: patientsData, refetch } = useQuery(
    trpc.patient.getAll.queryOptions({})
  );

  const deletePatientMutation = useMutation(
    trpc.patient.delete.mutationOptions({
      onSuccess: () => {
        setPatientToDelete(null);
        toast.success(t('deleteSuccess'));
        refetch();
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : t('deleteError');
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
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('description')}</p>
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
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDescription')}
        confirmText={t('deleteButton')}
        variant="destructive"
      />
    </div>
  );
}
