'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from '@/constants/icons';
import { useTRPC } from '@/trpc/client';

interface MedicalRecordFormData {
  tooth?: string;
  diagnosis?: string;
  treatment: string;
  notes?: string;
}

interface NewRecordDialogProps {
  appointmentId: string;
  patientId: string;
}

export function NewRecordDialog({
  appointmentId,
  patientId,
}: NewRecordDialogProps) {
  const t = useTranslations('admin.patients');
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalRecordFormData>();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: createRecord, isPending } = useMutation(
    trpc.medicalRecord.create.mutationOptions({
      onSuccess: () => {
        reset();
        setOpen(false);
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

  const onSubmit = (data: MedicalRecordFormData) => {
    createRecord({
      appointmentId,
      patientId,
      treatment: data.treatment,
      tooth: data.tooth || undefined,
      diagnosis: data.diagnosis || undefined,
      notes: data.notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {t('addRecord')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('newMedicalRecord')}</DialogTitle>
          <DialogDescription>
            {t('newMedicalRecordDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="treatment">
              {t('treatment')} <span className="text-destructive">*</span>
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
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder={t('recordNotesPlaceholder')}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('saving') : t('saveButton')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
