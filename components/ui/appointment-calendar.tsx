'use client';

import { useLocale, useTranslations } from 'next-intl';

import { CircleCheckIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

const EMPTY_TIME_SLOTS: TimeSlot[] = [];
const EMPTY_DISABLED_DATES: number[] = [];
const EMPTY_DISABLED_DAYS_OF_WEEK: number[] = [];

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
  density?: 'default' | 'compact';
}

function AppointmentCalendar({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  timeSlots = EMPTY_TIME_SLOTS,
  disabledDates: disabledTimestamps = EMPTY_DISABLED_DATES,
  disabledDaysOfWeek = EMPTY_DISABLED_DAYS_OF_WEEK,
  disabled = false,
  disablePastDates = true,
  isLoadingSlots = false,
  locale: localeProp,
  className,
  density = 'default',
}: AppointmentCalendarProps) {
  const locale = useLocale();
  const t = useTranslations('home.booking');

  // Map next-intl locale to Intl.Locale
  const intlLocale = locale === 'sr' ? 'sr-Latn' : 'en-US';

  // Convert timestamps to Date objects for react-day-picker
  const disabledDateObjects = disabledTimestamps.map((ts) => new Date(ts));
  const isCompact = density === 'compact';

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
        isCompact && 'rounded-xl border-border/40',
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
          density={density}
          className={cn('w-full bg-transparent', isCompact && 'md:flex-1')}
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleString(intlLocale, { weekday: 'short' }),
            formatCaption: (date) =>
              date.toLocaleString(intlLocale, {
                month: 'long',
                year: 'numeric',
              }),
          }}
        />

        <div
          className={cn(
            'relative min-h-48 w-full',
            isCompact && 'min-h-40 md:w-[220px] md:min-w-[220px]'
          )}
        >
          <div className="absolute inset-0 grid gap-4">
            <div
              className={cn('space-y-2 px-4 pt-4', isCompact && 'px-3 pt-3')}
            >
              <p
                className={cn(
                  'text-center text-sm font-medium',
                  isCompact && 'text-xs'
                )}
              >
                {!selectedDate
                  ? t('calendarSelectDate')
                  : isLoadingSlots
                    ? t('calendarLoading')
                    : timeSlots.length === 0
                      ? t('calendarNoSlots')
                      : t('calendarAvailableSlots')}
              </p>
            </div>
            <ScrollArea className="h-full overflow-y-auto">
              <div
                className={cn(
                  'grid grid-cols-1 gap-2 px-4 pb-4',
                  isCompact && 'gap-1.5 px-3 pb-3'
                )}
              >
                {selectedDate &&
                  !isLoadingSlots &&
                  timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      className={cn('rounded-full', isCompact && 'h-7 text-xs')}
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
        <div
          className={cn(
            'border-t border-border/50 bg-background/30 px-4 py-3',
            isCompact && 'px-3 py-2.5'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 text-sm',
              isCompact && 'text-xs'
            )}
          >
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
