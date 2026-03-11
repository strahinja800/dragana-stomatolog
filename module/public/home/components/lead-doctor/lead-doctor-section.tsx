import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ArrowRight, Award, GraduationCap, Star } from '@/constants/icons';
import { dentist1 } from '@/data/data';

export default function LeadDoctorSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-4xl border border-border/60 shadow-card">
              <Image
                src={dentist1}
                alt="Dr. Ana Jovanović, glavni stomatolog DENTALHOLIST ordinacije"
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                width={1920}
                height={1080}
              />
            </div>

            <div className="absolute -bottom-6 right-4 max-w-72 rounded-3xl border border-border/70 bg-card/96 p-5 shadow-hover md:right-8">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">
                    15+ godina
                  </p>
                  <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
                    kliničkog iskustva
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  Ocena 5.0
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="section-kicker">Glavni Stomatolog</span>
            <div>
              <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                Dr. Ana Jovanović
              </h2>
              <p className="mt-2 font-semibold tracking-wide text-primary uppercase">
                Specijalista estetske stomatologije
              </p>
            </div>

            <p className="text-lg text-muted-foreground">
              Sa više od 15 godina iskustva, dr Ana vodi tim fokusiran na
              preciznu i nežnu stomatologiju. Svaki plan terapije je
              personalizovan i oslonjen na savremenu dijagnostiku.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <GraduationCap className="h-5 w-5" />
                  <p className="font-semibold text-foreground">Edukacija</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stomatološki fakultet Univerziteta u Beogradu + međunarodne
                  edukacije.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" />
                  <p className="font-semibold text-foreground">Fokus</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Estetska i restaurativna stomatologija uz dugoročno praćenje.
                </p>
              </div>
            </div>

            <Button asChild className="btn-shimmer rounded-full px-6">
              <Link href="/o-nama">
                Upoznajte ceo tim
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
