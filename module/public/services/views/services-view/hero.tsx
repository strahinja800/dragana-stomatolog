import { Sparkles, Star } from 'lucide-react';

import CtaServices from './cta-services';
import FeaturedServices from './featured-services';
import ServicesGrid from './services-grid';
import TrustSection from './trust-section';

export default function ServicesHero() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden pt-34 pb-20 md:pt-40 md:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-16 right-[8%] h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute bottom-0 left-[5%] h-56 w-56 rounded-full bg-accent/8 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 h-2 w-2 rounded-full bg-accent/40 animate-float-slow" />
          <div className="absolute top-1/4 right-1/4 h-1.5 w-1.5 rounded-full bg-primary/30 animate-float-slow [animation-delay:-3s]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center animate-fade-up">
            <span className="section-kicker">
              <Sparkles className="h-3.5 w-3.5" />
              Naše usluge
            </span>

            <h1 className="mt-6 font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              Kompletna stomatološka nega{' '}
              <span className="text-gradient">sa premium pristupom</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Od preventive do kompleksnih rehabilitacija, svaka terapija je
              vođena individualnim planom i jasnom komunikacijom.
            </p>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <span className="font-medium">5.0 ocena</span>
              </div>
              <span className="h-4 w-px bg-border" />
              <span>8 specijalnosti</span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="hidden sm:inline">10.000+ pacijenata</span>
            </div>
          </div>
        </div>
      </section>

      <FeaturedServices />
      <ServicesGrid />
      <TrustSection />
      <CtaServices />
    </>
  );
}
