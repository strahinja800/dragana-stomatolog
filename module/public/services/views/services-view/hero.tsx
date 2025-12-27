import CtaServices from '@/module/public/services/views/services-view/cta-services';

import ServicesGrid from './services-grid';

export default function ServicesHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-40 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium mb-6">
              Naše usluge
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Kompletna stomatološka nega za celu porodicu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Od preventive do naprednih estetskih tretmana, nudimo sve što vam
              je potrebno za zdrav i lep osmeh na jednom mestu.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <ServicesGrid />

      {/* CTA Section */}
      <CtaServices />
    </>
  );
}
