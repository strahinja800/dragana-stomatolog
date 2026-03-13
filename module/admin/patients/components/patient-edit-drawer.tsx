'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { PatientData } from '@/module/admin/patients/types/patient-types';
import { useTRPC } from '@/trpc/client';

interface PatientEditFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  allergies?: string;
  medications?: string;
  notes?: string;
}

interface PatientEditDrawerProps {
  patient: PatientData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientEditDrawer({
  patient,
  open,
  onOpenChange,
}: PatientEditDrawerProps) {
  const [selectedGender, setSelectedGender] = useState<
    'MALE' | 'FEMALE' | undefined
  >(patient.gender ?? undefined);

  useEffect(() => {
    setSelectedGender(patient.gender ?? undefined);
  }, [open, patient.id, patient.gender]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientEditFormData>({
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email ?? '',
      phone: patient.phone ?? '',
      dateOfBirth: patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
        : '',
      allergies: patient.allergies ?? '',
      medications: patient.medications ?? '',
      notes: patient.notes ?? '',
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: updatePatient, isPending: isSubmitting } = useMutation(
    trpc.patient.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['patient'] });
        onOpenChange(false);
        toast.success('Pacijent je uspešno ažuriran');
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Greška pri ažuriranju pacijenta';
        toast.error(message);
      },
    })
  );

  const onSubmit = (data: PatientEditFormData) => {
    updatePatient({
      id: patient.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: selectedGender,
      allergies: data.allergies || undefined,
      medications: data.medications || undefined,
      notes: data.notes || undefined,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-screen max-w-4xl">
        <div className="mx-auto h-full w-full max-w-2xl overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Izmeni pacijenta</DrawerTitle>
            <DrawerDescription>
              Ažurirajte podatke pacijenta {patient.firstName}{' '}
              {patient.lastName}
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    Ime <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register('firstName', { required: 'Ime je obavezno' })}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Prezime <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register('lastName', {
                      required: 'Prezime je obavezno',
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Datum rođenja</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Pol</Label>
                  <Select
                    value={selectedGender}
                    onValueChange={(value) =>
                      setSelectedGender(value as 'MALE' | 'FEMALE')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite pol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Muški</SelectItem>
                      <SelectItem value="FEMALE">Ženski</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergije</Label>
                  <Input
                    id="allergies"
                    {...register('allergies')}
                    placeholder="Npr. Penicilin..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Terapija/Lekovi</Label>
                  <Input
                    id="medications"
                    {...register('medications')}
                    placeholder="Npr. Aspirin..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Napomene</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Dodatne napomene o pacijentu..."
                  rows={3}
                />
              </div>
            </div>

            <DrawerFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Čuvanje...' : 'Sačuvaj izmene'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Otkaži</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
