'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2 } from '@/constants/icons';
import type {
  AppointmentWithRelations,
  MedicalRecordWithRelations,
} from '@/module/admin/patients/types/patient-types';
import { useTRPC } from '@/trpc/client';

import { MedicalRecordAttachmentsDrawer } from './medical-record-attachments-drawer';

interface MedicalRecordFormData {
  treatment: string;
  tooth?: string;
  diagnosis?: string;
  notes?: string;
}

interface AppointmentDetailsDrawerProps {
  appointment: AppointmentWithRelations | null;
  records: MedicalRecordWithRelations[];
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDrawer({
  appointment,
  records,
  patientId,
  open,
  onOpenChange,
}: AppointmentDetailsDrawerProps) {
  const t = useTranslations('admin.patients');
  const [view, setView] = useState<'list' | 'add-record'>('list');
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalRecordFormData>();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: createRecord, isPending: isCreating } = useMutation(
    trpc.medicalRecord.create.mutationOptions({
      onSuccess: () => {
        reset();
        setView('list');
        toast.success(t('recordSaveSuccess'));
        queryClient.invalidateQueries({ queryKey: ['patient'] });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : t('recordSaveError');
        toast.error(message);
      },
    })
  );

  const { mutate: deleteRecord } = useMutation(
    trpc.medicalRecord.delete.mutationOptions({
      onSuccess: () => {
        setRecordToDelete(null);
        toast.success(t('deleteRecordSuccess'));
        queryClient.invalidateQueries({ queryKey: ['patient'] });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : t('deleteRecordError');
        toast.error(message);
      },
    })
  );

  const onSubmit = (data: MedicalRecordFormData) => {
    if (!appointment) return;
    createRecord({
      appointmentId: appointment.id,
      patientId,
      treatment: data.treatment,
      tooth: data.tooth || undefined,
      diagnosis: data.diagnosis || undefined,
      notes: data.notes || undefined,
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setView('list');
      reset();
      setRecordToDelete(null);
    }
    onOpenChange(open);
  };

  if (!appointment) return null;

  const startDate = new Date(appointment.startTime);

  return (
    <>
      <Drawer open={open} onOpenChange={handleClose} direction="right">
        <DrawerContent className="h-screen max-w-lg">
          <div className="flex h-full flex-col">
            <DrawerHeader className="border-b">
              {view === 'add-record' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setView('list');
                      reset();
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <DrawerTitle>{t('newRecord')}</DrawerTitle>
                    <DrawerDescription>
                      {t('appointmentForLabel')}{' '}
                      {startDate.toLocaleDateString('sr-RS', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}{' '}
                      u{' '}
                      {startDate.toLocaleTimeString('sr-RS', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </DrawerDescription>
                  </div>
                </div>
              ) : (
                <div>
                  <DrawerTitle>
                    {startDate.toLocaleDateString('sr-RS', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </DrawerTitle>
                  <DrawerDescription>
                    {startDate.toLocaleTimeString('sr-RS', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {appointment.serviceType &&
                      ` · ${appointment.serviceType.name}`}
                  </DrawerDescription>
                </div>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto">
              {view === 'list' ? (
                <div className="space-y-4 p-4">
                  {(appointment.symptoms || appointment.notes) && (
                    <div className="space-y-3">
                      {appointment.symptoms && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t('symptoms')}
                          </p>
                          <p className="mt-1 text-sm">{appointment.symptoms}</p>
                        </div>
                      )}
                      {appointment.notes && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t('symptomNote')}
                          </p>
                          <p className="mt-1 text-sm">{appointment.notes}</p>
                        </div>
                      )}
                      <Separator />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">
                        {t('medicalRecords')}
                      </p>
                      <Badge
                        variant={records.length > 0 ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {records.length}
                      </Badge>
                    </div>
                  </div>

                  {records.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('noRecords')}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {records.map((record) => (
                        <div
                          key={record.id}
                          className="rounded-lg border bg-card p-3 text-sm shadow-sm"
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="grid flex-1 gap-1.5">
                              <div>
                                <span className="font-medium">
                                  {t('treatmentLabel')}{' '}
                                </span>
                                {record.treatment}
                              </div>
                              {record.tooth && (
                                <div>
                                  <span className="font-medium">
                                    {t('toothLabel')}{' '}
                                  </span>
                                  {record.tooth}
                                </div>
                              )}
                              {record.diagnosis && (
                                <div>
                                  <span className="font-medium">
                                    {t('diagnosisLabel')}{' '}
                                  </span>
                                  {record.diagnosis}
                                </div>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <MedicalRecordAttachmentsDrawer
                                medicalRecordId={record.id}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => setRecordToDelete(record.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {record.notes && (
                            <p className="mt-1 text-muted-foreground">
                              <span className="font-medium">
                                {t('noteLabel')}{' '}
                              </span>
                              {record.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <form
                  id="add-record-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="treatment">
                      {t('treatment')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="treatment"
                      {...register('treatment', {
                        required: t('treatmentRequired'),
                      })}
                      placeholder={t('treatmentPlaceholder')}
                    />
                    {errors.treatment && (
                      <p className="text-sm text-destructive">
                        {errors.treatment.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tooth">{t('tooth')}</Label>
                    <Input
                      id="tooth"
                      {...register('tooth')}
                      placeholder={t('toothPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">{t('diagnosis')}</Label>
                    <Input
                      id="diagnosis"
                      {...register('diagnosis')}
                      placeholder={t('diagnosisPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="record-notes">{t('notes')}</Label>
                    <Textarea
                      id="record-notes"
                      {...register('notes')}
                      placeholder={t('recordNotesPlaceholder')}
                      rows={3}
                    />
                  </div>
                </form>
              )}
            </div>

            <DrawerFooter className="border-t">
              {view === 'list' ? (
                <Button
                  onClick={() => setView('add-record')}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('addRecord')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="add-record-form"
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? t('savingRecord') : t('saveRecord')}
                </Button>
              )}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <ConfirmDialog
        open={!!recordToDelete}
        onOpenChange={(open) => !open && setRecordToDelete(null)}
        onConfirm={() => recordToDelete && deleteRecord({ id: recordToDelete })}
        title="Potvrda brisanja"
        description="Da li ste sigurni da želite da obrišete ovaj zapis?"
        confirmText="Obriši"
        variant="destructive"
      />
    </>
  );
}
