import { bookingProcessSteps } from '@/data/data';

export default function BookingProcessSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-2xl text-center md:mx-auto">
          <span className="section-kicker">Online Zakazivanje</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            Kako funkcioniše zakazivanje
          </h2>
          <p className="mt-4 text-muted-foreground">
            Jednostavan i brz proces koji vam obezbeđuje potvrdu termina i
            automatski podsetnik pre pregleda.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {bookingProcessSteps.map((item, index) => (
            <article
              key={item.step}
              className="section-shell animate-fade-up p-6 md:p-7"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                Korak {item.step}
              </p>
              <h3 className="text-2xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
