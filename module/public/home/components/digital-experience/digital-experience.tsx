import { BellRing, CalendarCheck, ShieldCheck, Smartphone } from '@/constants/icons';

const features = [
  {
    name: 'Online zakazivanje',
    description:
      'Rezervišite termin bez poziva, kada vama odgovara, direktno kroz sajt.',
    icon: CalendarCheck,
  },
  {
    name: 'Email podsetnici',
    description:
      'Dobijate potvrdu i automatski podsetnik 24h pre potvrđenog termina.',
    icon: BellRing,
  },
  {
    name: 'Digitalni karton',
    description:
      'Organizovana istorija pregleda i plan terapije dostupni vašem timu.',
    icon: Smartphone,
  },
  {
    name: 'Privatnost podataka',
    description:
      'Podaci pacijenata se čuvaju u skladu sa visokim standardima bezbednosti.',
    icon: ShieldCheck,
  },
];

export default function DigitalExperienceSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="section-shell overflow-hidden p-7 md:p-10">
          <div className="mb-10 max-w-2xl">
            <span className="section-kicker">Digital Experience</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
              Premium iskustvo i nakon zakazivanja
            </h2>
            <p className="mt-4 text-muted-foreground">
              DENTALHOLIST nije samo tretman, već sistem koji poštuje vaše vreme
              i olakšava svaki naredni dolazak.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.name}
                className="rounded-2xl border border-border/70 bg-background/70 p-5 transition-smooth hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
