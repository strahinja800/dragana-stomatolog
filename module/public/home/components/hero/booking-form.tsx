'use client';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Calendar, CheckCircle, Phone, User } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
}

const bookingFormSchema = z.object({
  name: z.string().min(1, 'Ime je obavezno'),
  phone: z.string().min(1, 'Broj telefona je obavezan'),
  date: z.string().min(1, 'Datum je obavezan'),
});
export default function BookingForm() {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      date: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = (data: BookingFormData) => console.log(data);

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-4xl p-3 md:p-6 shadow-hover border border-border/50">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-heading font-bold text-foreground mb-2 max-sm:mb-0">
          Brzo zakazivanje
        </h3>
        <p className="text-muted-foreground text-sm">
          Popunite formu i javićemo vam se u roku od 30 minuta
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-name">Ime i prezime</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="booking-name"
                    type="text"
                    placeholder="Vaše ime i prezime"
                    aria-invalid={fieldState.invalid}
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-phone">Broj telefona</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="booking-phone"
                    type="tel"
                    placeholder="060 123 4567"
                    aria-invalid={fieldState.invalid}
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="booking-date">Željeni datum</FieldLabel>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    id="booking-date"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full mt-4 gradient-primary hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] rounded-4xl cursor-pointer"
        >
          {isPending ? 'Slanje...' : 'Zakažite sada'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span>Besplatna konsultacija</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span>Bez čekanja</span>
        </div>
      </div>
    </div>
  );
}
