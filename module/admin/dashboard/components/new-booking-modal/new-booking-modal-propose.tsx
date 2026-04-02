'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { enUS, sr } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarDays, Clock, Loader2, RefreshCw } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

interface NewBookingModalProposeProps {
  appointmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewBookingModalPropose({
  appointmentId,
  onSuccess,
  onCancel,
}: NewBookingModalProposeProps) {
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: proposeTime, isPending } = useMutation(
    trpc.appointment.proposeTime.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointment'] });
        toast.success('Predlog poslan', {
          description: 'Pacijent će biti obavešten o novom predloženom terminu',
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error('Greška pri predlaganju termina', {
          description:
            error instanceof Error ? error.message : 'Nepoznata greška',
        });
      },
    })
  );

  const isValid = newDate && newTime.match(/^\d{2}:\d{2}$/);

  return (
    <div className="space-y-4">
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
                ? format(newDate, 'd. MMMM yyyy.', { locale: dateLocale })
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

      {newDate && newTime && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-sm text-muted-foreground">Predloženi termin:</p>
          <p className="font-medium">
            {format(newDate, 'EEEE, d. MMMM yyyy.', { locale: dateLocale })} u{' '}
            {newTime}
          </p>
        </div>
      )}

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
          onClick={() => {
            if (!isValid || !newDate) return;
            proposeTime({ id: appointmentId, newDate, newTime });
          }}
          disabled={!isValid || isPending}
          className="flex-1 gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Slanje...
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              Predloži novi termin
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
