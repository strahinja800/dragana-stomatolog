'use client';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Loader2,
  Phone,
  User,
} from 'lucide-react';
import * as z from 'zod';

import { cn } from '@/lib/utils';

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

interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  icon: React.ReactNode;
  step: number;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
}

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  icon,
  step,
  isInvalid,
  errorMessage,
  disabled,
  placeholder,
}: FloatingInputProps) {
  const isFilled = value.length > 0;

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${step * 100}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {step}
        </span>
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground/80 transition-colors group-focus-within:text-primary"
        >
          {label}
        </label>
      </div>

      <div className="relative">
        {/* Icon */}
        <div
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10',
            'text-muted-foreground group-focus-within:text-primary',
            isInvalid && 'text-destructive'
          )}
        >
          {icon}
        </div>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          className={cn(
            // Base styles
            'peer w-full h-12 pl-12 pr-4 rounded-2xl',
            'bg-background/50 backdrop-blur-sm',
            'border-2 border-border/50',
            'text-foreground placeholder:text-muted-foreground/60',
            'text-base transition-all duration-300',
            // Focus styles
            'focus:outline-none focus:border-primary/50',
            'focus:shadow-[0_0_0_4px_hsl(199_89%_48%/0.1)]',
            'focus:bg-background/80',
            // Hover styles
            'hover:border-border hover:bg-background/60',
            // Disabled styles
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Invalid styles
            isInvalid && [
              'border-destructive/50 focus:border-destructive/70',
              'focus:shadow-[0_0_0_4px_hsl(0_84%_60%/0.1)]',
            ]
          )}
        />

        {/* Valid indicator */}
        {isFilled && !isInvalid && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>

      {/* Error message */}
      {isInvalid && errorMessage && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1.5 animate-fade-in">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

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
    <div className="relative bg-card/95 backdrop-blur-xl rounded-4xl p-4 md:p-8 shadow-hover border border-border/30 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.04] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            Brzo zakazivanje
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
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
                icon={<User className="w-5 h-5" />}
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
                icon={<Phone className="w-5 h-5" />}
                step={2}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                disabled={isPending}
                placeholder="060 123 4567"
              />
            )}
          />

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <FloatingInput
                id="booking-date"
                label="Željeni datum"
                type="date"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                icon={<Calendar className="w-5 h-5" />}
                step={3}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                disabled={isPending}
              />
            )}
          />

          {/* Submit button */}
          <div
            className="pt-2 animate-fade-up"
            style={{ animationDelay: '350ms', animationFillMode: 'both' }}
          >
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'group relative w-full h-14 rounded-2xl',
                'gradient-primary text-white font-semibold text-base',
                'shadow-soft hover:shadow-hover',
                'transition-all duration-300',
                'hover:scale-[1.02] active:scale-[0.98]',
                'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100',
                'overflow-hidden'
              )}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Button content */}
              <span className="relative flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Slanje...</span>
                  </>
                ) : (
                  <>
                    <span>Zakažite sada</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Trust indicators */}
        <div
          className="mt-8 pt-6 border-t border-border/30 animate-fade-up"
          style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                Besplatna konsultacija
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Bez čekanja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
