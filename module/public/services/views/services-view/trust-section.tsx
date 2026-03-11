import { Award, Microscope, ShieldCheck, Users } from '@/constants/icons';

const TRUST_POINTS = [
  {
    icon: Microscope,
    title: 'Savremena tehnologija',
    description:
      'Digitalna dijagnostika, 3D skeniranje i najnovija oprema za precizne tretmane.',
  },
  {
    icon: Award,
    title: '15+ godina iskustva',
    description:
      'Stručni tim sa dugogodišnjim kliničkim iskustvom i međunarodnim edukacijama.',
  },
  {
    icon: Users,
    title: 'Individualni pristup',
    description:
      'Svaki pacijent dobija personalizovani plan terapije i potpunu posvećenost.',
  },
  {
    icon: ShieldCheck,
    title: 'Garancija kvaliteta',
    description:
      'Koristimo premium materijale i pratimo najviše standarde u stomatologiji.',
  },
] as const;

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="section-kicker">Zašto DENTALHOLIST</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Zašto nas pacijenti biraju
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Kombinacija stručnosti, tehnologije i iskrene brige za svakog
            pacijenta.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:gap-6">
          {TRUST_POINTS.map((point, index) => (
            <article
              key={point.title}
              className="group section-shell relative overflow-hidden p-7 transition-smooth hover:-translate-y-1 hover:shadow-hover-blue sm:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 h-1 w-full gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-soft">
                  <point.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
