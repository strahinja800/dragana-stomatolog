'use client';
import { ArrowRight, CheckCircle, Phone, User } from 'lucide-react';

import { AppointmentCalendar } from '@/components/ui/appointment-calendar';
import { FloatingInput } from '@/components/ui/floating-input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function BookingFormSkeleton() {
  const noop = () => {};

  return (
    <div className="relative overflow-hidden rounded-4xl border border-border/30 bg-card/95 p-4 shadow-hover backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.04]" />

      <div className="relative z-10">
        <div className="mb-6 text-center">
          <h3 className="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Brzo zakazivanje
          </h3>
          <p className="text-sm text-muted-foreground md:text-base">
            Popunite formu i javićemo vam se u roku od 30 minuta
          </p>
        </div>

        <div className="space-y-5">
          <FloatingInput
            id="skeleton-name"
            label="Ime i prezime"
            type="text"
            value=""
            onChange={noop}
            onBlur={noop}
            icon={<User className="size-5" />}
            step={1}
            disabled
            placeholder="Vaše ime i prezime"
          />

          <FloatingInput
            id="skeleton-phone"
            label="Broj telefona"
            type="tel"
            value=""
            onChange={noop}
            onBlur={noop}
            icon={<Phone className="size-5" />}
            step={2}
            disabled
            placeholder="060 123 4567"
          />

          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Izaberite datum i vreme
              </span>
            </div>

            <AppointmentCalendar
              selectedDate={undefined}
              selectedTime={null}
              onDateSelect={noop}
              onTimeSelect={noop}
              timeSlots={[]}
              bookedDates={[]}
              disabledDaysOfWeek={[]}
              disabled
            />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                4
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Opišite simptome (opciono)
              </span>
            </div>

            <Textarea
              id="skeleton-symptoms"
              placeholder="Opišite vaše simptome ili razlog posete..."
              className="min-h-20 resize-none"
              disabled
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled
              className={cn(
                'group relative h-14 w-full rounded-2xl',
                'gradient-primary text-base font-semibold text-white',
                'shadow-soft',
                'disabled:cursor-not-allowed disabled:opacity-60',
                'overflow-hidden'
              )}
            >
              <span className="relative flex items-center justify-center gap-2">
                <span>Zakažite sada</span>
                <ArrowRight className="size-5" />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-border/30 pt-5">
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
