'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
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
        toast.success('Medical record je uspešno sačuvan');
        queryClient.invalidateQueries({ queryKey: ['patient'] });
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Greška pri čuvanju medical recorda';
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
          Dodaj record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novi Medical Record</DialogTitle>
          <DialogDescription>
            Unesite podatke o tretmanu i dijagnozi
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="treatment">
              Tretman <span className="text-destructive">*</span>
            </Label>
            <Input
              id="treatment"
              {...register('treatment', {
                required: 'Tretman je obavezan',
              })}
              placeholder="Npr. Plomba, Vađenje, Čišćenje..."
            />
            {errors.treatment && (
              <p className="text-sm text-destructive">
                {errors.treatment.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tooth">Zub</Label>
            <Input
              id="tooth"
              {...register('tooth')}
              placeholder="Npr. 16, 21..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Dijagnoza</Label>
            <Input
              id="diagnosis"
              {...register('diagnosis')}
              placeholder="Npr. Karijes, Gingivitis..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Napomene</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Dodatne napomene..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Otkaži
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Čuvanje...' : 'Sačuvaj'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
