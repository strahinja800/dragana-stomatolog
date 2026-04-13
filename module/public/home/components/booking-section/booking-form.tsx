'use client';

import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { startOfDay } from 'date-fns';
import { z } from 'zod';

import { AppointmentCalendar } from '@/components/ui/appointment-calendar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle, Loader2 } from '@/constants/icons';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

import { BookingRegistrationModal } from './booking-registration-modal';

interface BookingFormInput {
  date?: Date;
  time: string;
  symptoms: string;
}

interface BookingDraft {
  date: Date;
  time: string;
  symptoms?: string;
}

interface BookingFormProps {
  patientId?: string;
  onSuccess?: () => void;
  hideHeader?: boolean;
  compact?: boolean;
  className?: string;
}

const today = startOfDay(new Date());

export default function BookingForm({
  patientId,
  onSuccess: onSuccessCallback,
  hideHeader = false,
  compact = false,
  className,
}: BookingFormProps = {}) {
  const t = useTranslations('home.booking');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => today
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);

  const { data: session, isPending: isSessionPending } = useSession();
  const isLoggedIn = !!session?.user;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const schema = z.object({
    date: z.date({ message: t('validationDate') }),
    time: z.string().min(1, t('validationTime')),
    symptoms: z.string().optional(),
  });

  const {
    data: nonWorkingDays,
    isLoading: isLoadingNonWorkingDays,
    isPending: isPendingNonWorkingDays,
  } = useSuspenseQuery(trpc.appointment.getNonWorkingDays.queryOptions());

  const { data: timeSlots, isFetching: isLoadingTimeSlots } = useQuery(
    trpc.appointment.getTimeSlotsForDate.queryOptions({
      date: selectedDate ?? today,
    })
  );

  const isPendingData =
    isPendingNonWorkingDays || isLoadingNonWorkingDays || isLoadingTimeSlots;

  useSubscription(
    trpc.subscriptions.onSettingsUpdate.subscriptionOptions(undefined, {
      onData: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.appointment.getNonWorkingDays.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.appointment.getTimeSlotsForDate.queryKey(),
        });
      },
    })
  );

  useSubscription(
    trpc.subscriptions.onAppointmentSlotChanged.subscriptionOptions(undefined, {
      onData: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.appointment.getTimeSlotsForDate.queryKey(),
        });
      },
    })
  );

  const { closedDaysOfWeek, disabledDates } = nonWorkingDays ?? {
    closedDaysOfWeek: [],
    disabledDates: [],
  };

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      date: undefined,
      time: '',
      symptoms: '',
    },
  });

  const selectedTime = useWatch({ control: form.control, name: 'time' });

  // Admin booking for patient
  const { mutate: createPatientAppointment, isPending: isCreatingPatient } =
    useMutation(
      trpc.appointment.createForPatient.mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['appointment'] });
          queryClient.invalidateQueries({ queryKey: ['patient'] });
          onSuccessCallback?.();
        },
      })
    );

  // Logged-in patient self-booking
  const { mutateAsync: bookAppointment, isPending: isBooking } = useMutation(
    trpc.appointment.book.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['appointment'] });
        setIsSuccess(true);
        await queryClient.invalidateQueries({
          queryKey: trpc.appointment.getTimeSlotsForDate.queryKey(),
        });
      },
    })
  );

  const isSubmitting =
    form.formState.isSubmitting || isCreatingPatient || isBooking;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue('date', date, { shouldValidate: !!date });
    form.setValue('time', '', { shouldValidate: false });
  };

  const handleTimeSelect = (time: string) => {
    form.setValue('time', time, { shouldValidate: true });
  };

  const onSubmit = (data: BookingFormInput) => {
    if (!data.date) return;

    // Admin mode: book for patient
    if (patientId) {
      createPatientAppointment({
        patientId,
        date: data.date,
        time: data.time,
        symptoms: data.symptoms || undefined,
      });
      return;
    }

    const draft: BookingDraft = {
      date: data.date,
      time: data.time,
      symptoms: data.symptoms || undefined,
    };

    // Logged-in user: book directly
    if (isLoggedIn) {
      bookAppointment({
        date: draft.date,
        time: draft.time,
        symptoms: draft.symptoms,
      });
      return;
    }

    // Not logged in: show registration modal
    setBookingDraft(draft);
    setAuthModalOpen(true);
  };

  const handleAuthenticatedBook = async (
    draft: BookingDraft,
    profile?: {
      firstName: string;
      lastName: string;
      phone: string;
      dateOfBirth?: Date;
      gender?: 'MALE' | 'FEMALE';
    }
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      await bookAppointment({
        date: draft.date,
        time: draft.time,
        symptoms: draft.symptoms,
        profile: profile
          ? {
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
              dateOfBirth: profile.dateOfBirth,
              gender: profile.gender,
            }
          : undefined,
      });
      return { ok: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('authModal.slotTaken');
      return { ok: false, error: message };
    }
  };

  if (isSuccess) {
    return (
      <div
        className={cn(
          'section-shell relative overflow-hidden border-border/40 p-4 md:p-8',
          compact && 'mx-auto max-w-[46rem] p-4 md:p-6',
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.08]" />

        <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            {t('successTitle')}
          </h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            {t('successDescription')}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
              setSelectedDate(today);
            }}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {t('bookAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'section-shell relative overflow-hidden border-border/40 p-4 md:p-8',
          compact && 'mx-auto max-w-[46rem] p-4 md:p-6',
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.08]" />

        <div className="relative z-10">
          {!hideHeader && (
            <div
              className={cn(
                'animate-fade-up text-center',
                compact ? 'mb-5' : 'mb-6'
              )}
            >
              <h3
                className={cn(
                  'font-bold text-foreground',
                  compact
                    ? 'mb-1.5 text-xl md:text-2xl'
                    : 'mb-2 text-2xl md:text-3xl'
                )}
              >
                {t('formTitle')}
              </h3>
              <p
                className={cn(
                  'text-sm text-muted-foreground',
                  compact ? 'md:text-sm' : 'md:text-base'
                )}
              >
                {t('formDescription')}
              </p>
            </div>
          )}

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(compact ? 'space-y-4' : 'space-y-5')}
          >
            <div
              className="animate-fade-up"
              style={{ animationDelay: '220ms', animationFillMode: 'both' }}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                <span className="text-sm font-medium text-foreground/80">
                  {t('fieldDateTime')}
                </span>
              </div>

              <AppointmentCalendar
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
                timeSlots={timeSlots ?? []}
                disabledDates={disabledDates}
                disabledDaysOfWeek={closedDaysOfWeek}
                disabled={isPendingData}
                isLoadingSlots={isLoadingTimeSlots}
                density={compact ? 'compact' : 'default'}
              />

              {(form.formState.errors.date || form.formState.errors.time) && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive animate-fade-in">
                  <span className="inline-block size-1 rounded-full bg-destructive" />
                  {form.formState.errors.date?.message ||
                    form.formState.errors.time?.message}
                </p>
              )}
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: '260ms', animationFillMode: 'both' }}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                <span className="text-sm font-medium text-foreground/80">
                  {t('fieldSymptoms')}
                </span>
              </div>

              <Controller
                name="symptoms"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="booking-symptoms"
                    placeholder={t('fieldSymptomsPlaceholder')}
                    className={cn(
                      compact ? 'min-h-16' : 'min-h-20',
                      'resize-none'
                    )}
                    disabled={isPendingData}
                  />
                )}
              />
            </div>

            <div
              className="animate-fade-up pt-2"
              style={{ animationDelay: '320ms', animationFillMode: 'both' }}
            >
              <button
                type="submit"
                disabled={isSubmitting || isPendingData || isSessionPending}
                className={cn(
                  'group relative w-full overflow-hidden font-semibold text-white',
                  compact
                    ? 'h-12 rounded-xl text-sm'
                    : 'h-14 rounded-2xl text-base',
                  'gradient-primary',
                  'shadow-soft hover:shadow-hover',
                  'transition-all duration-300',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
                )}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                </div>

                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>{t('submittingButton')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('submitButton')}</span>
                      <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div
            className={cn(
              'mt-6 border-t border-border/30 pt-5 animate-fade-up',
              compact && 'mt-5 pt-4'
            )}
            style={{ animationDelay: '360ms', animationFillMode: 'both' }}
          >
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2.5 text-sm">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="size-4 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  {t('emailConfirmation')}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="size-4 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  {t('reminderNote')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingDraft && (
        <BookingRegistrationModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          draft={bookingDraft}
          onAuthenticatedBook={handleAuthenticatedBook}
        />
      )}
    </>
  );
}
