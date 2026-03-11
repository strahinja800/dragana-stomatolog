import Image from 'next/image';

import { Award, Clock, Users } from '@/constants/icons';
import { dentist1, dentist2 } from '@/data/data';

const stats = [
  { icon: Clock, value: '15+', label: 'godina iskustva' },
  { icon: Users, value: '10k+', label: 'pacijenata' },
  { icon: Award, value: '7', label: 'specijalista' },
];

export default function AboutHero() {
  return (
    <section className="relative gradient-hero pt-34 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-accent/8 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <span className="section-kicker">O nama</span>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              DENTALHOLIST koncept{' '}
              <span className="text-gradient">pažljive</span>, savremene
              stomatologije
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
              Od 2009. godine razvijamo praksu koja kombinuje vrhunsku
              stručnost, transparentnu komunikaciju i premium iskustvo
              pacijenta.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group section-shell p-4 text-center transition-smooth hover:-translate-y-0.5 hover:shadow-hover-blue sm:p-5"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-primary sm:h-11 sm:w-11">
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 h-72 w-72 rounded-full border border-accent/20 opacity-60 md:h-96 md:w-96" />
            <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full border border-primary/15 opacity-50" />

            <div className="relative grid grid-cols-5 gap-4">
              <div className="col-span-3 overflow-hidden rounded-3xl border border-border/60 shadow-card">
                <Image
                  src={dentist1}
                  alt="DENTALHOLIST tim"
                  className="h-72 w-full object-cover sm:h-96"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </div>
              <div className="col-span-2 mt-10 overflow-hidden rounded-3xl border border-border/60 shadow-card">
                <Image
                  src={dentist2}
                  alt="DENTALHOLIST ordinacija"
                  className="h-72 w-full object-cover sm:h-96"
                  sizes="(max-width: 1024px) 40vw, 20vw"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-border/70 bg-card/96 p-4 shadow-hover backdrop-blur-sm sm:left-8 sm:right-8">
              <p className="text-center text-sm font-medium text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Licencirani tim
                </span>{' '}
                sa međunarodnim edukacijama i premium protokolima
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
