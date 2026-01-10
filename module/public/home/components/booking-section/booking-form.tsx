'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { ArrowRight, CheckCircle, Loader2, Phone, User } from 'lucide-react';
import * as z from 'zod';

import { AppointmentCalendar } from '@/components/ui/appointment-calendar';
import { FloatingInput } from '@/components/ui/floating-input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

const bookingFormSchema = z.object({
  name: z.string().min(1, 'Ime je obavezno'),
  phone: z.string().min(1, 'Broj telefona je obavezan'),
  date: z.date({ error: 'Datum je obavezan' }),
  time: z.string().min(1, 'Vreme je obavezno'),
  symptoms: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

type BookingFormInput = {
  name: string;
  phone: string;
  date?: Date;
  time: string;
  symptoms: string;
};

export default function BookingForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const nonWorkingDays = useQuery(api.appointments.getNonWorkingDays);
  const { closedDaysOfWeek, disabledDates } = nonWorkingDays ?? {
    closedDaysOfWeek: [],
    disabledDates: [],
  };

  const timeSlots = useQuery(api.appointments.getTimeSlotsForDate, {
    date: selectedDate?.getTime() ?? new Date().getTime(),
  });

  console.log('timeSlots', timeSlots);

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema) as never,
    defaultValues: {
      name: '',
      phone: '',
      date: undefined,
      time: '',
      symptoms: '',
    },
  });

  const selectedTime = form.watch('time');

  const createAppointmentMutation = useMutation(
    api.appointments.createAppointment
  );

  const isPending = form.formState.isSubmitting;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue('date', date, { shouldValidate: !!date });
    form.setValue('time', '', { shouldValidate: false });
  };

  const handleTimeSelect = (time: string) => {
    form.setValue('time', time, { shouldValidate: true });
  };

  const onSubmit = async (data: BookingFormInput) => {
    if (!data.date) return;

    try {
      await createAppointmentMutation({
        name: data.name,
        phone: data.phone,
        date: data.date.getTime(),
        time: data.time,
        symptoms: data.symptoms || undefined,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  // Show success state after form submission
  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-4xl border border-border/30 bg-card/95 p-4 shadow-hover backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.04]" />

        <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Zahtev je poslat!
          </h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Hvala vam na poverenju. Javićemo vam se u roku od 30 minuta radi
            potvrde termina.
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
    <div className="relative overflow-hidden rounded-4xl border border-border/30 bg-card/95 p-4 shadow-hover backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.04]" />

      <div className="relative z-10">
        <div className="animate-fade-up mb-6 text-center">
          <h3 className="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Brzo zakazivanje
          </h3>
          <p className="text-sm text-muted-foreground md:text-base">
            Popunite formu i javićemo vam se u roku od 30 minuta
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                disabled={isPending}
                placeholder="Vaše ime i prezime"
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
                step={2}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                disabled={isPending}
                placeholder="060 123 4567"
              />
            )}
          />

          <div
            className="animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
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
              disabled={isPending}
              isLoadingSlots={timeSlots === undefined}
            />

            {(form.formState.errors.date || form.formState.errors.time) && (
              <p className="animate-fade-in mt-2 flex items-center gap-1.5 text-sm text-destructive">
                <span className="inline-block size-1 rounded-full bg-destructive" />
                {form.formState.errors.date?.message ||
                  form.formState.errors.time?.message}
              </p>
            )}
          </div>

          <div
            className="animate-fade-up"
            style={{ animationDelay: '250ms', animationFillMode: 'both' }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                4
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
                  className="min-h-20 resize-none"
                  disabled={isPending}
                />
              )}
            />
          </div>

          <div
            className="animate-fade-up pt-2"
            style={{ animationDelay: '350ms', animationFillMode: 'both' }}
          >
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'group relative h-14 w-full rounded-2xl',
                'gradient-primary text-base font-semibold text-white',
                'shadow-soft hover:shadow-hover',
                'transition-all duration-300',
                'hover:scale-[1.02] active:scale-[0.98]',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
                'overflow-hidden'
              )}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
              </div>

              <span className="relative flex items-center justify-center gap-2">
                {isPending ? (
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
          className="animate-fade-up mt-6 border-t border-border/30 pt-5"
          style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        >
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                Besplatna konsultacija
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Bez čekanja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
