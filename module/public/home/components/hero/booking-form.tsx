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
        <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary text-xs font-bold border border-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_20px_oklch(0.61_0.11_222/0.2)]">
          <span className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent" />
          <span className="relative z-10">{step}</span>
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
            'absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500 z-10',
            'text-muted-foreground group-focus-within:text-primary',
            'group-focus-within:drop-shadow-[0_0_8px_oklch(0.61_0.11_222/0.4)]',
            'group-focus-within:scale-110',
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
            'peer w-full h-14 pl-14 pr-5 rounded-2xl',
            'bg-linear-to-br from-background/70 to-background/50 backdrop-blur-md',
            'border-2 border-border/40',
            'shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]',
            'text-foreground placeholder:text-muted-foreground/60',
            'text-base transition-all duration-500 ease-out',
            // Focus styles
            'focus:outline-none focus:border-primary/60',
            'focus:shadow-[0_0_0_5px_oklch(0.61_0.11_222/0.12),0_8px_24px_-8px_oklch(0.61_0.11_222/0.3),inset_0_1px_2px_rgba(0,0,0,0.05)]',
            'focus:bg-linear-to-br focus:from-background/90 focus:to-background/70',
            // Hover styles
            'hover:border-primary/30 hover:bg-linear-to-br hover:from-background/80 hover:to-background/60',
            'hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(0,0,0,0.05)]',
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
          <div className="absolute right-5 top-1/2 -translate-y-1/2 animate-[fade-in_0.4s_ease-out,scale-bounce-in_0.5s_ease-out]">
            <div className="relative">
              <CheckCircle className="w-5 h-5 text-primary relative z-10 drop-shadow-[0_0_12px_oklch(0.61_0.11_222/0.6)]" />
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md scale-150" />
            </div>
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
    <div
      className="relative bg-card/90 backdrop-blur-2xl rounded-4xl p-6 md:p-10 border-2 border-transparent overflow-hidden before:absolute before:inset-0 before:rounded-4xl before:p-[2px] before:bg-gradient-to-br before:from-primary/30 before:via-primary/10 before:to-primary/30 before:-z-10 before:blur-sm"
      style={{
        boxShadow: 'var(--shadow-premium-card)',
      }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-primary/2 to-[oklch(0.71_0.13_215/0.06)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.61_0.11_222/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,oklch(0.71_0.13_215/0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 relative">
            <span className="relative z-10">Brzo zakazivanje</span>
            <span className="absolute inset-0 blur-xl opacity-30 bg-linear-to-r from-primary to-[oklch(0.71_0.13_215)] bg-clip-text text-transparent pointer-events-none">
              Brzo zakazivanje
            </span>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  'var(--shadow-premium-button-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  'var(--shadow-premium-button)';
              }}
              className={cn(
                'group relative w-full h-16 rounded-2xl',
                'text-white font-bold text-base tracking-wide',
                'border-2 border-primary/30',
                'overflow-hidden',
                'transition-all duration-500 ease-out',
                'hover:scale-[1.03] hover:border-primary/50 active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
              style={{
                background: 'var(--gradient-premium-button)',
                boxShadow: 'var(--shadow-premium-button)',
              }}
            >
              {/* Enhanced shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out bg-linear-to-r from-transparent via-white/30 to-transparent" />
              </div>

              {/* NEW: Radial highlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-linear-to-b from-white/10 to-transparent rounded-t-2xl" />
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
            <div className="group/trust flex items-center gap-3 text-sm px-4 py-2.5 rounded-full bg-linear-to-br from-background/60 to-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_4px_16px_-4px_oklch(0.61_0.11_222/0.2)]">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/5 shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_16px_oklch(0.61_0.11_222/0.2)] group-hover/trust:shadow-[0_2px_12px_rgba(0,0,0,0.15),0_0_24px_oklch(0.61_0.11_222/0.35)] transition-shadow duration-300">
                <CheckCircle className="w-4.5 h-4.5 text-primary relative z-10" />
                <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent" />
              </div>
              <span className="text-muted-foreground font-medium">
                Besplatna konsultacija
              </span>
            </div>
            <div className="group/trust flex items-center gap-3 text-sm px-4 py-2.5 rounded-full bg-linear-to-br from-background/60 to-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_4px_16px_-4px_oklch(0.61_0.11_222/0.2)]">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br from-primary/20 to-primary/5 shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_16px_oklch(0.61_0.11_222/0.2)] group-hover/trust:shadow-[0_2px_12px_rgba(0,0,0,0.15),0_0_24px_oklch(0.61_0.11_222/0.35)] transition-shadow duration-300">
                <CheckCircle className="w-4.5 h-4.5 text-primary relative z-10" />
                <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent" />
              </div>
              <span className="text-muted-foreground font-medium">
                Bez čekanja
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
