'use client';

import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { AlertTriangle, Loader2, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/lib/trpc';

interface RejectDialogProps {
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

export function RejectDialog({ appointment, onClose }: RejectDialogProps) {
  const [reason, setReason] = useState('');

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const { mutate: rejectAppointment, isPending } = useMutation(
    trpc.appointment.reject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointment'] });
        toast.success('Termin odbijen', {
          description: 'Pacijent će biti obavešten o odbijanju termina',
        });
        handleClose();
      },
      onError: (error) => {
        toast.error('Greška pri odbijanju', {
          description:
            error instanceof Error ? error.message : 'Nepoznata greška',
        });
      },
    })
  );

  const handleReject = () => {
    if (!appointment || !reason.trim()) return;
    rejectAppointment({
      id: appointment.id,
      reason: reason.trim(),
    });
  };

  const patientName = appointment?.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim()
    : 'Nepoznat pacijent';

  return (
    <Dialog open={!!appointment} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <X className="size-4 text-red-600 dark:text-red-400" />
            </div>
            Odbij termin
          </DialogTitle>
          <DialogDescription>
            Odbijate termin za{' '}
            <span className="font-medium text-foreground">{patientName}</span>{' '}
            {appointment && (
              <>
                zakazan za{' '}
                <span className="font-medium text-foreground">
                  {format(
                    new Date(appointment.startTime),
                    "d. MMMM 'u' HH:mm",
                    {
                      locale: sr,
                    }
                  )}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Pacijent će biti obavešten o odbijanju termina sa navedenim
              razlogom.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Razlog odbijanja *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Unesite razlog odbijanja termina..."
              className="min-h-24 resize-none"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Ovaj razlog će biti vidljiv pacijentu
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Otkaži
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!reason.trim() || isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Odbijanje...
              </>
            ) : (
              <>
                <X className="size-4" />
                Odbij termin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
