'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Pencil,
  Phone,
  Trash2,
  User,
} from '@/constants/icons';
import type { PatientData } from '@/module/admin/patients/types/patient-types';
import { useTRPC } from '@/trpc/client';

import { PatientEditDrawer } from './patient-edit-drawer';

interface PatientDetailsHeaderProps {
  patient: PatientData;
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const initials =
    [patient.firstName?.[0], patient.lastName?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase() || '?';

  const genderLabel =
    patient.gender === 'MALE'
      ? 'Muški'
      : patient.gender === 'FEMALE'
        ? 'Ženski'
        : null;

  const { mutate: deletePatient, isPending: isDeleting } = useMutation(
    trpc.patient.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['patient'] });
        toast.success('Pacijent je obrisan');
        router.push('/admin/patients');
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : 'Greška pri brisanju';
        toast.error(message);
        setDeleteOpen(false);
      },
    })
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nazad na listu
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Izmeni
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 text-lg">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {patient.firstName} {patient.lastName}
              </h1>
              <Badge variant={patient.isMain ? 'default' : 'secondary'}>
                {patient.isMain ? 'Glavni pacijent' : 'Sekundarni pacijent'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {patient.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
              )}
              {patient.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {patient.email}
                </span>
              )}
              {genderLabel && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {genderLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <PatientEditDrawer
        key={String(editOpen)}
        patient={patient}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => deletePatient({ id: patient.id })}
        title="Brisanje pacijenta"
        description="Da li ste sigurni da želite da obrišete ovog pacijenta? Pacijenti sa terminima ne mogu biti obrisani."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </>
  );
}
