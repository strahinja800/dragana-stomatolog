import { beforeAfterCases } from '@/data/data';
import BeforeAfterCompareCard from '@/module/public/home/components/before-after/before-after-compare-card';

export default function ResultsPage() {
  return (
    <main className="gradient-hero min-h-screen pb-20 pt-32 md:pt-36">
      <section className="container mx-auto px-4 xl:px-6">
        <div className="mb-12 max-w-3xl">
          <span className="section-kicker">Svi Primeri</span>
          <h1 className="mt-4 text-4xl font-semibold text-foreground md:text-5xl lg:text-6xl">
            Pre i posle rezultati tretmana
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Anonimizovani primeri planiranih terapija sa interaktivnim prikazom.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {beforeAfterCases.map((item, index) => (
            <BeforeAfterCompareCard
              key={item.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              title={item.title}
              summary={item.summary}
              beforeImage={item.beforeImage}
              afterImage={item.afterImage}
              beforeLabel={item.beforeLabel ?? 'PRE'}
              afterLabel={item.afterLabel ?? 'POSLE'}
              initialPosition={50}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
