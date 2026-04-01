'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { enUS, sr } from 'date-fns/locale';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from '@/constants/icons';
import type {
  AppointmentWithRelations,
  MedicalRecordWithRelations,
} from '@/module/admin/patients/types/patient-types';
import { useTRPC } from '@/trpc/client';

interface AppointmentsTableProps {
  appointments: AppointmentWithRelations[];
  recordsByAppointment: Record<string, MedicalRecordWithRelations[]>;
  onSelectAppointment: (appointmentId: string) => void;
}

export function AppointmentsTable({
  appointments,
  recordsByAppointment,
  onSelectAppointment,
}: AppointmentsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );

  const t = useTranslations('admin.patients');
  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: deleteAppointment, isPending: isDeleting } = useMutation(
    trpc.appointment.delete.mutationOptions({
      onSuccess: () => {
        toast.success(t('appointmentDeleteSuccess'));
        setDeleteDialogOpen(false);
        setAppointmentToDelete(null);
        queryClient.invalidateQueries({ queryKey: ['patient'] });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : t('appointmentDeleteError');
        toast.error(message);
      },
    })
  );

  const handleDeleteClick = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointmentToDelete(appointmentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointment({ id: appointmentToDelete });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('appointmentsTableDate')}</TableHead>
            <TableHead>{t('appointmentsTableTime')}</TableHead>
            <TableHead>{t('appointmentsTableSymptoms')}</TableHead>
            <TableHead>{t('appointmentsTableRecords')}</TableHead>
            <TableHead className="w-20">
              {t('appointmentsTableActions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const startDate = new Date(appointment.startTime);
            const records = recordsByAppointment[appointment.id] ?? [];

            return (
              <TableRow
                key={appointment.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSelectAppointment(appointment.id)}
              >
                <TableCell className="font-medium">
                  {format(startDate, 'd. MMMM yyyy.', { locale: dateLocale })}
                </TableCell>
                <TableCell>{format(startDate, 'HH:mm')}</TableCell>
                <TableCell>{appointment.symptoms || '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant={records.length > 0 ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {records.length > 0
                      ? `${records.length} ${records.length === 1 ? t('appointmentRecord') : t('appointmentRecords')}`
                      : t('appointmentNoRecords')}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteClick(appointment.id, e)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={t('appointmentDeleteTitle')}
        description={t('appointmentDeleteDescription')}
        confirmText={t('deleteButton')}
        cancelText={t('cancelButton')}
        variant="destructive"
      />
    </div>
  );
}
