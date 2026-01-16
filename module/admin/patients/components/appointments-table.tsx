'use client';

import { Fragment, useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import { type Doc, type Id } from '@/convex/_generated/dataModel';

import { MedicalRecordsList } from './medical-records-list';

interface AppointmentsTableProps {
  appointments: Doc<'appointments'>[];
  recordsByAppointment: Record<Id<'appointments'>, Doc<'medicalRecords'>[]>;
  expandedAppointments: Set<Id<'appointments'>>;
  onToggleAppointment: (appointmentId: Id<'appointments'>) => void;
}

export function AppointmentsTable({
  appointments,
  recordsByAppointment,
  expandedAppointments,
  onToggleAppointment,
}: AppointmentsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Id<'appointments'> | null>(null);

  const deleteAppointmentFn = useConvexMutation(
    api.appointments.deleteAppointment
  );
  const { mutate: deleteAppointment, isPending: isDeleting } = useMutation({
    mutationFn: deleteAppointmentFn,
    onSuccess: () => {
      toast.success('Termin je uspešno obrisan');
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Greška pri brisanju termina';
      toast.error(message);
    },
  });

  const handleDeleteClick = (
    appointmentId: Id<'appointments'>,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setAppointmentToDelete(appointmentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointment({ appointmentId: appointmentToDelete });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Vreme</TableHead>
            <TableHead>Simptomi</TableHead>
            <TableHead>Napomena</TableHead>
            <TableHead className="w-20">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const startDate = new Date(appointment.startTime);
            const records = recordsByAppointment[appointment._id] || [];
            const isExpanded = expandedAppointments.has(appointment._id);

            return (
              <Fragment key={appointment._id}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onToggleAppointment(appointment._id)}
                >
                  <TableCell>
                    {records.length > 0 &&
                      (isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </TableCell>
                  <TableCell className="font-medium">
                    {startDate.toLocaleDateString('sr-RS')}
                  </TableCell>
                  <TableCell>
                    {startDate.toLocaleTimeString('sr-RS', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{appointment.symptoms || '—'}</TableCell>
                  <TableCell>{appointment.notes || '—'}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(appointment._id, e)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded Content */}
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-muted/30 p-0">
                      <MedicalRecordsList
                        appointmentId={appointment._id}
                        records={records}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Brisanje termina"
        description="Da li ste sigurni da želite da obrišete ovaj termin? Svi zapisi vezani za ovaj termin će takođe biti obrisani."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </div>
  );
}
