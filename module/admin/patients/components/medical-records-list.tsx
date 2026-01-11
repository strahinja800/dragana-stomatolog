'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';

import { DeleteRecordDialog } from './delete-record-dialog';
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
  const deleteRecord = useMutation(api.medicalRecords.deleteMedicalRecord);

  const confirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await deleteRecord({ recordId: recordToDelete });
      setRecordToDelete(null);
      toast.success('Medical record je uspešno obrisan');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Greška pri brisanju medical recorda';
      toast.error(message);
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Medical Records</h4>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setRecordToDelete(record._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          Nema medical records za ovaj termin.
        </p>
      )}

      <DeleteRecordDialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
