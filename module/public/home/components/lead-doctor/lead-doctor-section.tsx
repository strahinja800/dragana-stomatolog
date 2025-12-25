import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Award, GraduationCap, Star } from 'lucide-react';

import dentist1 from '@/assets/dentist-1.jpg';
import { Button } from '@/components/ui/button';

export default function LeadDoctorSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-hover">
                <Image
                  src={dentist1}
                  alt="Dr. Ana Jovanović"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 lg:right-8 bg-card rounded-2xl p-6 shadow-hover border border-border max-w-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-3xl gradient-primary flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground">
                      15+ godina
                    </p>
                    <p className="text-sm text-muted-foreground">iskustva</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    5.0 ocena
                  </span>
                </div>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-8 -left-8 w-full h-full rounded-3xl bg-primary/10 -z-10" />
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium mb-4">
                Upoznajte našu glavnu lekarku
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                Dr. Ana Jovanović
              </h2>
              <p className="text-[rgb(13,162,231)] font-medium">
                Specijalista estetske stomatologije
              </p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Sa više od 15 godina iskustva u stomatologiji, dr. Ana Jovanović
              je posvećena pružanju vrhunske nege svakom pacijentu. Njena strast
              za estetskom stomatologijom i kontinuirano usavršavanje
              omogućavaju joj da primenjuje najnovije tehnike i tehnologije u
              svakodnevnoj praksi.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Diplomirala je na Stomatološkom fakultetu Univerziteta u Beogradu,
              a specijalizaciju je završila u Švajcarskoj. Redovno učestvuje na
              međunarodnim kongresima i radionicama kako bi svojim pacijentima
              pružila najbolju moguću negu.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <GraduationCap className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Stomatološki fakultet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Univerzitet u Beogradu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Specijalizacija
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estetska stomatologija
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="rounded-3xl text-lg px-8 py-6"
              asChild
            >
              <Link href="/o-nama">
                Više o timu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
