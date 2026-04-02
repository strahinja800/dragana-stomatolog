'use client';

import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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

interface NewBookingModalConfirmProps {
  appointmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewBookingModalConfirm({
  appointmentId,
  onSuccess,
  onCancel,
}: NewBookingModalConfirmProps) {
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [notes, setNotes] = useState('');

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: serviceTypes } = useQuery(
    trpc.settings.getServiceTypes.queryOptions()
  );
  const activeServices = (serviceTypes ?? []).filter((s) => s.isActive);
  const selectedService = activeServices.find((s) => s.id === serviceTypeId);

  const { mutate: confirmAppointment, isPending } = useMutation(
    trpc.appointment.confirm.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointment'] });
        toast.success('Termin potvrđen', {
          description: 'Pacijent će biti obavešten o potvrdi termina',
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error('Greška pri potvrđivanju', {
          description:
            error instanceof Error ? error.message : 'Nepoznata greška',
        });
      },
    })
  );

  return (
    <div className="space-y-4">
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

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1"
        >
          Nazad
        </Button>
        <Button
          onClick={() =>
            confirmAppointment({
              id: appointmentId,
              serviceTypeId,
              notes: notes || undefined,
            })
          }
          disabled={!serviceTypeId || isPending}
          className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
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
      </div>
    </div>
  );
}
