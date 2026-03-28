'use client';

import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { startOfDay } from 'date-fns';
import * as z from 'zod';

import { AppointmentCalendar } from '@/components/ui/appointment-calendar';
import { FloatingInput } from '@/components/ui/floating-input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  User,
} from '@/constants/icons';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

const getBookingFormSchema = (requiresEmail: boolean) =>
  z.object({
    name: z.string().min(1, 'Ime je obavezno'),
    email: requiresEmail
      ? z.string().email('Unesite validnu email adresu')
      : z.string().optional(),
    phone: z.string().min(1, 'Broj telefona je obavezan'),
    date: z.date({ error: 'Datum je obavezan' }),
    time: z.string().min(1, 'Vreme je obavezno'),
    symptoms: z.string().optional(),
  });

type BookingFormInput = {
  name: string;
  email?: string;
  phone: string;
  date?: Date;
  time: string;
  symptoms: string;
};

interface BookingFormProps {
  patientId?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  onSuccess?: () => void;
  hideHeader?: boolean;
  compact?: boolean;
  className?: string;
}

const today = startOfDay(new Date());

export default function BookingForm({
  patientId,
  defaultName = '',
  defaultEmail = '',
  defaultPhone = '',
  onSuccess: onSuccessCallback,
  hideHeader = false,
  compact = false,
  className,
}: BookingFormProps = {}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => today
  );

  const requiresEmail = !patientId;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

  const { closedDaysOfWeek, disabledDates } = nonWorkingDays ?? {
    closedDaysOfWeek: [],
    disabledDates: [],
  };

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(getBookingFormSchema(requiresEmail)) as never,
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      date: undefined,
      time: '',
      symptoms: '',
    },
  });

  const selectedTime = useWatch({ control: form.control, name: 'time' });

  const { mutate: createPublicAppointment, isPending: isCreatingPublic } =
    useMutation(
      trpc.appointment.create.mutationOptions({
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ['appointment'] });
          setIsSuccess(true);
          await queryClient.invalidateQueries({
            queryKey: trpc.appointment.getTimeSlotsForDate.queryKey(),
          });
        },
      })
    );

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

  const isSubmitting =
    form.formState.isSubmitting || isCreatingPublic || isCreatingPatient;

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

    if (patientId) {
      createPatientAppointment({
        patientId,
        date: data.date,
        time: data.time,
        symptoms: data.symptoms || undefined,
      });
      return;
    }

    createPublicAppointment({
      name: data.name,
      email: data.email ?? '',
      phone: data.phone,
      date: data.date,
      time: data.time,
      symptoms: data.symptoms || undefined,
    });
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
            Zahtev je uspešno poslat
          </h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Poslali smo potvrdu prijema na vaš email. Uskoro vam stižu i detalji
            termina.
          </p>

          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Zakažite još jedan termin
          </button>
        </div>
      </div>
    );
  }

  return (
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
              Brzo zakazivanje
            </h3>
            <p
              className={cn(
                'text-sm text-muted-foreground',
                compact ? 'md:text-sm' : 'md:text-base'
              )}
            >
              Popunite formu i dobićete potvrdu prijema na email
            </p>
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(compact ? 'space-y-4' : 'space-y-5')}
        >
          {!patientId && (
            <div className={cn(compact && 'grid gap-3 md:grid-cols-2')}>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FloatingInput
                    id="booking-name"
                    label="Ime i prezime"
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    icon={<User className="size-5" />}
                    step={1}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                    disabled={isPendingData}
                    placeholder="Vaše ime i prezime"
                    compact={compact}
                  />
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FloatingInput
                    id="booking-email"
                    label="Email adresa"
                    type="email"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    icon={<Mail className="size-5" />}
                    step={2}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                    disabled={isPendingData}
                    placeholder="vas@email.com"
                    compact={compact}
                  />
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FloatingInput
                    id="booking-phone"
                    label="Broj telefona"
                    type="tel"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    icon={<Phone className="size-5" />}
                    step={3}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                    disabled={isPendingData}
                    placeholder="060 123 4567"
                    compact={compact}
                  />
                )}
              />
            </div>
          )}

          <div
            className="animate-fade-up"
            style={{ animationDelay: '220ms', animationFillMode: 'both' }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {patientId ? 1 : 4}
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Izaberite datum i vreme
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
                {patientId ? 2 : 5}
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Opišite simptome (opciono)
              </span>
            </div>

            <Controller
              name="symptoms"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="booking-symptoms"
                  placeholder="Opišite vaše simptome ili razlog posete..."
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
              disabled={isSubmitting || isPendingData}
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
                    <span>Slanje...</span>
                  </>
                ) : (
                  <>
                    <span>Zakažite sada</span>
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
                Email potvrda prijema
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                Podsetnik 24h pre termina
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
