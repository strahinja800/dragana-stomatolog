'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

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
  DrawerTrigger,
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
import { Plus } from '@/constants/icons';
import { useTRPC } from '@/trpc/client';

interface PatientFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  allergies?: string;
  medications?: string;
  notes?: string;
}

interface NewPatientDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewPatientDrawer({
  open: openProp,
  onOpenChange,
}: NewPatientDrawerProps = {}) {
  const t = useTranslations('admin.patients');
  const [internalOpen, setInternalOpen] = useState(false);

  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [selectedGender, setSelectedGender] = useState<
    'MALE' | 'FEMALE' | undefined
  >();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: createPatient, isPending: isSubmitting } = useMutation(
    trpc.patient.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['patient'] });
        reset();
        setSelectedGender(undefined);
        setOpen(false);
        toast.success(t('createSuccess'));
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : t('createError');
        toast.error(message);
      },
    })
  );

  const onSubmit = (data: PatientFormData) => {
    const dateOfBirth = data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : undefined;

    createPatient({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      dateOfBirth,
      gender: selectedGender,
    });
  };

  const isControlled = openProp !== undefined;

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      {!isControlled && (
        <DrawerTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('newPatient')}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="h-screen max-w-4xl">
        <div className="mx-auto h-full w-full max-w-2xl overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{t('newPatient')}</DrawerTitle>
            <DrawerDescription>{t('newPatientDescription')}</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-4">
            <div className="grid gap-4 py-4">
              {/* Ime i Prezime */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t('firstName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    className="bg-white"
                    {...register('firstName', {
                      required: t('firstNameRequired'),
                    })}
                    placeholder="Marko"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {t('lastName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    className="bg-white"
                    {...register('lastName', {
                      required: t('lastNameRequired'),
                    })}
                    placeholder="Petrović"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email i Telefon */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-white"
                    {...register('email')}
                    placeholder="marko@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    className="bg-white"
                    {...register('phone')}
                    placeholder="+381 60 123 4567"
                  />
                </div>
              </div>

              {/* Datum rođenja i Pol */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t('dateOfBirth')}</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="bg-white"
                    {...register('dateOfBirth')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">{t('gender')}</Label>
                  <Select
                    value={selectedGender}
                    onValueChange={(value) =>
                      setSelectedGender(value as 'MALE' | 'FEMALE')
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder={t('selectGender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t('male')}</SelectItem>
                      <SelectItem value="FEMALE">{t('female')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Napomene */}
              <div className="space-y-2">
                <Label htmlFor="notes">{t('notes')}</Label>
                <Textarea
                  id="notes"
                  className="bg-white"
                  {...register('notes')}
                  placeholder={t('notesPlaceholder')}
                  rows={3}
                />
              </div>
            </div>

            <DrawerFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('creating') : t('createButton')}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">{t('cancel')}</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
