'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { enUS, sr } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, Clock, Loader2 } from '@/constants/icons';
import { useTRPC } from '@/trpc/client';

interface ConfirmDialogProps {
  appointment: {
    id: string;
    startTime: Date;
    patient: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  onClose: () => void;
}

export function ConfirmDialog({ appointment, onClose }: ConfirmDialogProps) {
  const [serviceTypeId, setServiceTypeId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: serviceTypes } = useQuery(
    trpc.settings.getServiceTypes.queryOptions()
  );
  const activeServices = (serviceTypes ?? []).filter((s) => s.isActive);

  const handleClose = () => {
    setServiceTypeId('');
    setNotes('');
    onClose();
  };

  const { mutate: confirmAppointment, isPending } = useMutation(
    trpc.appointment.confirm.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointment'] });
        toast.success('Termin potvrđen', {
          description: 'Pacijent će biti obavešten o potvrdi termina',
        });
        handleClose();
      },
      onError: (error) => {
        toast.error('Greška pri potvrđivanju', {
          description:
            error instanceof Error ? error.message : 'Nepoznata greška',
        });
      },
    })
  );

  const handleConfirm = () => {
    if (!appointment || !serviceTypeId) return;
    confirmAppointment({
      id: appointment.id,
      serviceTypeId,
      notes: notes || undefined,
    });
  };

  const selectedService = activeServices.find((s) => s.id === serviceTypeId);
  const patientName = appointment?.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim()
    : 'Nepoznat pacijent';

  return (
    <Dialog open={!!appointment} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Potvrdi termin
          </DialogTitle>
          <DialogDescription>
            Potvrđujete termin za{' '}
            <span className="font-medium text-foreground">{patientName}</span>{' '}
            {appointment && (
              <>
                zakazan za{' '}
                <span className="font-medium text-foreground">
                  {format(
                    new Date(appointment.startTime),
                    "d. MMMM 'u' HH:mm",
                    {
                      locale: dateLocale,
                    }
                  )}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Service Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">Tip usluge *</Label>
            <Select value={serviceTypeId} onValueChange={setServiceTypeId}>
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Izaberite uslugu" />
              </SelectTrigger>
              <SelectContent>
                {activeServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center gap-2">
                      <span>{service.name}</span>
                      <span className="text-muted-foreground">
                        ({service.durationMinutes} min)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                <span>Trajanje: {selectedService.durationMinutes} minuta</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Beleška (opciono)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dodatne napomene za termin..."
              className="min-h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Otkaži
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!serviceTypeId || isPending}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Potvrđivanje...
              </>
            ) : (
              <>
                <Check className="size-4" />
                Potvrdi termin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
