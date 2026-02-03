'use client';

import { Controller, useForm } from 'react-hook-form';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/trpc/client';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface MilestoneFormProps {
  open: boolean;
  onClose: () => void;
  milestone?: Milestone;
}

interface FormData {
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export function MilestoneForm({
  open,
  onClose,
  milestone,
}: MilestoneFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      year: milestone?.year ?? '',
      title: milestone?.title ?? '',
      description: milestone?.description ?? '',
      sortOrder: milestone?.sortOrder ?? 1,
      isActive: milestone?.isActive ?? true,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleClose = () => {
    reset();
    onClose();
  };

  const { mutate: createMilestone, isPending: isCreating } = useMutation(
    trpc.about.createMilestone.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Postignuće uspešno kreirano');
        handleClose();
      },
      onError: (error) => {
        toast.error('Greška pri čuvanju postignuća');
        console.error(error);
      },
    })
  );

  const { mutate: updateMilestone, isPending: isUpdating } = useMutation(
    trpc.about.updateMilestone.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Postignuće uspešno ažurirano');
        handleClose();
      },
      onError: (error) => {
        toast.error('Greška pri čuvanju postignuća');
        console.error(error);
      },
    })
  );

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (data: FormData) => {
    if (milestone) {
      updateMilestone({
        id: milestone.id,
        year: data.year,
        title: data.title,
        description: data.description,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else {
      createMilestone({
        year: data.year,
        title: data.title,
        description: data.description,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {milestone ? 'Izmeni postignuće' : 'Dodaj novo postignuće'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">
                Godina{' '}
                <span className="text-xs text-muted-foreground">
                  (npr. 2009, 2024)
                </span>
              </Label>
              <Input
                id="year"
                {...register('year', { required: 'Godina je obavezna' })}
                placeholder="2024"
              />
              {errors.year && (
                <p className="text-sm text-destructive">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Naslov</Label>
              <Input
                id="title"
                {...register('title', { required: 'Naslov je obavezan' })}
                placeholder="Osnivanje klinike"
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Opis je obavezan' })}
                placeholder="Otvorena prva ordinacija u centru Beograda"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Redosled</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register('sortOrder', {
                  required: 'Redosled je obavezan',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Minimum je 1' },
                })}
                placeholder="1"
              />
              {errors.sortOrder && (
                <p className="text-sm text-destructive">
                  {errors.sortOrder.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <>
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Aktivno postignuće
                    </Label>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Otkaži
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Čuvanje...' : milestone ? 'Ažuriraj' : 'Kreiraj'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
