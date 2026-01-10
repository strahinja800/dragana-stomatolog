'use client';

import { CircleCheckIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface AppointmentCalendarProps {
  selectedDate?: Date;
  selectedTime?: string | null;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  timeSlots?: TimeSlot[];
  /** Timestamps (Unix ms) of dates to disable - backend returns these directly */
  disabledDates?: number[];
  disabledDaysOfWeek?: number[];
  disabled?: boolean;
  disablePastDates?: boolean;
  isLoadingSlots?: boolean;
  locale?: string;
  className?: string;
}

function AppointmentCalendar({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  timeSlots = [],
  disabledDates: disabledTimestamps = [],
  disabledDaysOfWeek = [],
  disabled = false,
  disablePastDates = true,
  isLoadingSlots = false,
  locale = 'sr-Latn',
  className,
}: AppointmentCalendarProps) {
  // Convert timestamps to Date objects for react-day-picker
  const disabledDateObjects = disabledTimestamps.map((ts) => new Date(ts));

  const calendarDisabledDates = [
    ...(disablePastDates ? [{ before: new Date() }] : []),
    ...disabledDateObjects,
    ...(disabledDaysOfWeek.length > 0
      ? [{ dayOfWeek: disabledDaysOfWeek }]
      : []),
  ];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border-2 border-border/50 bg-background/50 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col divide-y md:flex-row md:divide-x md:divide-y-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={calendarDisabledDates}
          showOutsideDays={false}
          weekStartsOn={1}
          modifiers={{
            booked: disabledDateObjects,
          }}
          modifiersClassNames={{
            booked: '[&>button]:line-through opacity-100',
          }}
          className="bg-transparent  w-full"
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleString(locale, { weekday: 'short' }),
            formatCaption: (date) =>
              date.toLocaleString(locale, {
                month: 'long',
                year: 'numeric',
              }),
          }}
        />

        <div className="relative min-h-48 w-full">
          <div className="absolute inset-0 grid gap-4">
            <div className="space-y-2 px-4 pt-4">
              <p className="text-center text-sm font-medium">
                {!selectedDate
                  ? 'Izaberite datum'
                  : isLoadingSlots
                    ? 'Učitavanje...'
                    : timeSlots.length === 0
                      ? 'Nema slobodnih termina'
                      : 'Dostupni termini'}
              </p>
            </div>
            <ScrollArea className="h-full overflow-y-auto">
              <div className="grid grid-cols-1 gap-2 px-4 pb-4">
                {selectedDate &&
                  !isLoadingSlots &&
                  timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      className="rounded-full"
                      size="sm"
                      variant={
                        selectedTime === slot.time ? 'default' : 'outline'
                      }
                      onClick={() => onTimeSelect(slot.time)}
                      disabled={disabled || !slot.isAvailable}
                    >
                      {slot.time}
                    </Button>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {(selectedDate || selectedTime) && (
        <div className="border-t border-border/50 bg-background/30 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            {selectedDate && selectedTime ? (
              <>
                <CircleCheckIcon className="size-5 stroke-green-600 dark:stroke-green-400" />
                <span>
                  {locale === 'sr-Latn' ? 'Vaš termin: ' : 'Your appointment: '}
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString(locale, {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>{' '}
                  {locale === 'sr-Latn' ? 'u' : 'at'}{' '}
                  <span className="font-medium">{selectedTime}</span>
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">
                {selectedDate
                  ? locale === 'sr-Latn'
                    ? 'Izaberite vreme'
                    : 'Select time'
                  : locale === 'sr-Latn'
                    ? 'Izaberite datum'
                    : 'Select date'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { AppointmentCalendar, type AppointmentCalendarProps };
