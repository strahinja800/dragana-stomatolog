'use client';

import { Controller, useForm } from 'react-hook-form';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
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
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';

interface AboutValue {
  _id: Id<'aboutValues'>;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface AboutValueFormProps {
  open: boolean;
  onClose: () => void;
  value?: AboutValue;
}

interface FormData {
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export function AboutValueForm({ open, onClose, value }: AboutValueFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      icon: value?.icon ?? '',
      title: value?.title ?? '',
      description: value?.description ?? '',
      sortOrder: value?.sortOrder ?? 1,
      isActive: value?.isActive ?? true,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  const createValueFn = useConvexMutation(api.aboutValues.createAboutValue);
  const { mutate: createValue, isPending: isCreating } = useMutation({
    mutationFn: createValueFn,
    onSuccess: () => {
      toast.success('Vrednost uspešno kreirana');
      handleClose();
    },
    onError: (error) => {
      toast.error('Greška pri čuvanju vrednosti');
      console.error(error);
    },
  });

  const updateValueFn = useConvexMutation(api.aboutValues.updateAboutValue);
  const { mutate: updateValue, isPending: isUpdating } = useMutation({
    mutationFn: updateValueFn,
    onSuccess: () => {
      toast.success('Vrednost uspešno ažurirana');
      handleClose();
    },
    onError: (error) => {
      toast.error('Greška pri čuvanju vrednosti');
      console.error(error);
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (data: FormData) => {
    if (value) {
      updateValue({
        id: value._id,
        icon: data.icon,
        title: data.title,
        description: data.description,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      });
    } else {
      createValue({
        icon: data.icon,
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
            {value ? 'Izmeni vrednost' : 'Dodaj novu vrednost'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">
                Ikona{' '}
                <span className="text-xs text-muted-foreground">
                  (npr. Heart, Award, Users, Sparkles)
                </span>
              </Label>
              <Input
                id="icon"
                {...register('icon', { required: 'Ikona je obavezna' })}
                placeholder="Heart"
              />
              {errors.icon && (
                <p className="text-sm text-destructive">
                  {errors.icon.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Naslov</Label>
              <Input
                id="title"
                {...register('title', { required: 'Naslov je obavezan' })}
                placeholder="Briga o pacijentima"
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
                placeholder="Vaše zdravlje i komfor su nam na prvom mestu..."
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
                      Aktivna vrednost
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
              {isSubmitting ? 'Čuvanje...' : value ? 'Ažuriraj' : 'Kreiraj'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
