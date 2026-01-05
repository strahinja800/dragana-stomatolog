import { CalendarCheck, Clock, MessageCircle, Stethoscope } from 'lucide-react';

import BookingForm from './booking-form';

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

export default function BookingSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-primary/[0.08]" />

      {/* Decorative blur orbs for depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Left side - description */}
          <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Zakažite pregled
              <span className="block text-primary">brzo i jednostavno</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Rezervišite svoj termin online u samo par klikova. Bez čekanja,
              bez telefonskih poziva - izaberite vreme koje vam odgovara.
            </p>

            <ul className="space-y-4 pt-2">
              {features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - booking form */}
          <div className="lg:col-span-3">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
