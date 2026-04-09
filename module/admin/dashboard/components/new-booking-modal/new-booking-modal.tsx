/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { format } from 'date-fns';
import { sr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BellRing,
  CalendarDays,
  Check,
  Mail,
  Phone,
  RefreshCw,
  Stethoscope,
  User,
  X,
} from '@/constants/icons';
import type { AppointmentCreatedEvent } from '@/lib/events';

import { NewBookingModalConfirm } from './new-booking-modal-confirm';
import { NewBookingModalPropose } from './new-booking-modal-propose';

type ModalView = 'info' | 'confirm' | 'propose';

interface NewBookingModalProps {
  event: AppointmentCreatedEvent | null;
  open: boolean;
  onClose: () => void;
}

export function NewBookingModal({
  event,
  open,
  onClose,
}: NewBookingModalProps) {
  const [view, setView] = useState<ModalView>('info');
  const originalTitleRef = useRef('');
  const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopBlinking = useCallback(() => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }
    if (originalTitleRef.current) {
      document.title = originalTitleRef.current;
    }
  }, []);

  // Tab blinking when modal is open
  useEffect(() => {
    if (!open) {
      stopBlinking();
      return;
    }

    originalTitleRef.current = document.title;
    let isAlternate = false;
    blinkIntervalRef.current = setInterval(() => {
      document.title = isAlternate
        ? originalTitleRef.current
        : `🔔 Nova rezervacija!`;
      isAlternate = !isAlternate;
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        stopBlinking();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopBlinking();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [open, stopBlinking]);

  // Reset view when modal opens
  useEffect(() => {
    if (open) setView('info');
  }, [open]);

  if (!event) return null;

  const startTime = new Date(event.startTime);
  const formatted = format(startTime, "d. MMMM yyyy. 'u' HH:mm", {
    locale: sr,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-3xl overflow-y-auto max-h-[90vh]"
        onClick={stopBlinking}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <BellRing className="size-5 animate-pulse text-amber-500" />
            </div>
            Nova rezervacija
          </DialogTitle>
        </DialogHeader>

        {view === 'info' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              <span className="font-semibold">{formatted}</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Podaci o pacijentu
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <User className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Ime i prezime
                    </p>
                    <p className="truncate font-medium">{event.patientName}</p>
                  </div>
                </div>

                {event.phone && (
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Phone className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <p className="truncate font-medium">{event.phone}</p>
                    </div>
                  </div>
                )}

                {event.email && (
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="truncate font-medium">{event.email}</p>
                    </div>
                  </div>
                )}

                {event.symptoms && (
                  <div className="flex items-start gap-3 rounded-lg border p-3 sm:col-span-2">
                    <Stethoscope className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Simptomi / napomena
                      </p>
                      <p className="font-medium">{event.symptoms}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 gap-2"
              >
                <X className="size-4" />
                Zatvori
              </Button>
              <Button
                variant="outline"
                onClick={() => setView('propose')}
                className="flex-1 gap-2"
              >
                <RefreshCw className="size-4" />
                Predloži novo vreme
              </Button>
              <Button
                onClick={() => setView('confirm')}
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="size-4" />
                Potvrdi termin
              </Button>
            </div>
          </div>
        )}

        {view === 'confirm' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Potvrđujete termin za{' '}
              <span className="font-medium text-foreground">
                {event.patientName}
              </span>{' '}
              zakazan za{' '}
              <span className="font-medium text-foreground">{formatted}</span>
            </p>
            <NewBookingModalConfirm
              appointmentId={event.appointmentId}
              onSuccess={onClose}
              onCancel={() => setView('info')}
            />
          </div>
        )}

        {view === 'propose' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Predlažete novi termin za{' '}
              <span className="font-medium text-foreground">
                {event.patientName}
              </span>
            </p>
            <NewBookingModalPropose
              appointmentId={event.appointmentId}
              onSuccess={onClose}
              onCancel={() => setView('info')}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
