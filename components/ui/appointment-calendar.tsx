'use client';

import { CircleCheckIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const DEFAULT_TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

interface AppointmentCalendarProps {
  selectedDate?: Date;
  selectedTime?: string | null;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  timeSlots?: string[];
  bookedDates?: Date[];
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
  timeSlots = DEFAULT_TIME_SLOTS,
  bookedDates = [],
  disabledDaysOfWeek = [],
  disabled = false,
  disablePastDates = true,
  isLoadingSlots = false,
  locale = 'sr-Latn',
  className,
}: AppointmentCalendarProps) {
  const disabledDates = [
    ...(disablePastDates ? [{ before: new Date() }] : []),
    ...bookedDates,
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
      <div className="relative md:pr-40">
        <div className="flex justify-center p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={disabledDates}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: '[&>button]:line-through opacity-100',
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(9)]"
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
        </div>

        <div className="flex w-full flex-col gap-4 border-t max-md:h-48 md:absolute md:inset-y-0 md:right-0 md:w-40 md:border-l md:border-t-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
              {!selectedDate ? (
                <p className="text-center text-sm text-muted-foreground">
                  Izaberite datum
                </p>
              ) : isLoadingSlots ? (
                <p className="text-center text-sm text-muted-foreground">
                  Učitavanje...
                </p>
              ) : timeSlots.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Nema slobodnih termina
                </p>
              ) : (
                timeSlots.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => onTimeSelect(time)}
                    className="w-full shadow-none"
                    disabled={disabled}
                  >
                    {time}
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
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
