'use client';

import {
  ArrowRight,
  CalendarCheck,
  CheckCircle,
  Clock,
  MessageCircle,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react';

import { AppointmentCalendar } from '@/components/ui/appointment-calendar';
import { FloatingInput } from '@/components/ui/floating-input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: CalendarCheck,
    text: 'Online zakazivanje 24/7',
  },
  {
    icon: MessageCircle,
    text: 'Potvrda termina putem SMS-a',
  },
  {
    icon: Stethoscope,
    text: 'Besplatna prva konsultacija',
  },
  {
    icon: Clock,
    text: 'Fleksibilno radno vreme',
  },
];

export function BookingSectionSkeleton() {
  const noop = () => {};

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-primary/[0.08]" />

      {/* Decorative blur orbs for depth */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Left side - description */}
          <div className="space-y-6 text-center lg:col-span-2 lg:text-left">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Zakažite pregled
              <span className="block text-primary">brzo i jednostavno</span>
            </h2>

            <p className="text-lg leading-relaxed text-muted-foreground">
              Rezervišite svoj termin online u samo par klikova. Bez čekanja,
              bez telefonskih poziva - izaberite vreme koje vam odgovara.
            </p>

            <ul className="space-y-4 pt-2">
              {features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center justify-center gap-3 lg:justify-start"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - booking form skeleton */}
          <div className="lg:col-span-3">
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
                      disabledDates={[]}
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
          </div>
        </div>
      </div>
    </section>
  );
}
