'use client';

import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';

import { MedicalRecordAttachmentsDrawer } from './medical-record-attachments-drawer';
import { NewRecordDialog } from './new-record-dialog';

interface MedicalRecord {
  _id: Id<'medicalRecords'>;
  appointmentId: Id<'appointments'>;
  tooth?: string;
  diagnosis?: string;
  treatment: string;
  notes?: string;
  [key: string]: unknown;
}

interface MedicalRecordsListProps {
  appointmentId: Id<'appointments'>;
  records: MedicalRecord[];
}

export function MedicalRecordsList({
  appointmentId,
  records,
}: MedicalRecordsListProps) {
  const [recordToDelete, setRecordToDelete] =
    useState<Id<'medicalRecords'> | null>(null);

  const deleteRecordFn = useConvexMutation(
    api.medicalRecords.deleteMedicalRecord
  );
  const { mutate: deleteRecord } = useMutation({
    mutationFn: deleteRecordFn,
    onSuccess: () => {
      setRecordToDelete(null);
      toast.success('Medical record je uspešno obrisan');
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Greška pri brisanju medical recorda';
      toast.error(message);
    },
  });

  const confirmDelete = () => {
    if (!recordToDelete) return;
    deleteRecord({ recordId: recordToDelete });
  };

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Medicinski zapisi</h4>
        <NewRecordDialog appointmentId={appointmentId} />
      </div>

      {records.length > 0 ? (
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record._id}
              className="rounded-md border bg-background p-3 text-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="grid flex-1 gap-2 md:grid-cols-3">
                  {record.tooth && (
                    <div>
                      <span className="font-medium">Zub: </span>
                      {record.tooth}
                    </div>
                  )}
                  {record.diagnosis && (
                    <div>
                      <span className="font-medium">Dijagnoza: </span>
                      {record.diagnosis}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Tretman: </span>
                    {record.treatment}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MedicalRecordAttachmentsDrawer
                    medicalRecordId={record._id}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setRecordToDelete(record._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {record.notes && (
                <div className="mt-2 text-muted-foreground">
                  <span className="font-medium">Napomena: </span>
                  {record.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nema medicinskih zapisa za ovaj termin.
        </p>
      )}

      <ConfirmDialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
        onConfirm={confirmDelete}
        title="Potvrda brisanja"
        description="Da li ste sigurni da želite da obrišete ovaj medical record?"
        confirmText="Obriši"
        variant="destructive"
      />
    </div>
  );
}
