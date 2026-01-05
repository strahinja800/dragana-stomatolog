'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { CalendarDays, Clock, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RescheduleDialogProps {
  appointment: {
    _id: Id<'appointments'>;
    startTime: number;
    patient: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  onClose: () => void;
}

export function RescheduleDialog({
  appointment,
  onClose,
}: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const rescheduleAppointmentMutation = useMutation(
    api.appointments.rescheduleAppointment
  );

  const handleClose = () => {
    setNewDate(undefined);
    setNewTime('');
    onClose();
  };

  const handleReschedule = async () => {
    if (!appointment || !newDate || !newTime) return;

    setIsPending(true);
    try {
      await rescheduleAppointmentMutation({
        id: appointment._id,
        newDate: newDate.getTime(),
        newTime,
      });
      toast.success('Termin promenjen', {
        description: 'Pacijent će biti obavešten o novom vremenu',
      });
      handleClose();
    } catch (error) {
      toast.error('Greška pri promeni termina', {
        description:
          error instanceof Error ? error.message : 'Nepoznata greška',
      });
    } finally {
      setIsPending(false);
    }
  };

  const patientName = appointment?.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim()
    : 'Nepoznat pacijent';

  const isValid = newDate && newTime.match(/^\d{2}:\d{2}$/);

  return (
    <Dialog open={!!appointment} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <RefreshCw className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            Promeni vreme termina
          </DialogTitle>
          <DialogDescription>
            Menjate termin za{' '}
            <span className="font-medium text-foreground">{patientName}</span>{' '}
            {appointment && (
              <>
                trenutno zakazan za{' '}
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
          {/* New Date */}
          <div className="space-y-2">
            <Label>Novi datum *</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !newDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarDays className="mr-2 size-4" />
                  {newDate
                    ? format(newDate, 'd. MMMM yyyy.', { locale: sr })
                    : 'Izaberite datum'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={(date) => {
                    setNewDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* New Time */}
          <div className="space-y-2">
            <Label htmlFor="newTime">Novo vreme *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="newTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Preview */}
          {newDate && newTime && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">Novi termin:</p>
              <p className="font-medium">
                {format(newDate, 'EEEE, d. MMMM yyyy.', { locale: sr })} u{' '}
                {newTime}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Otkaži
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!isValid || isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Čuvanje...
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                Promeni termin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
