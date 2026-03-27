import { getIcon } from '@/module/public/about/lib/icon-map';

const VALUES = [
  {
    id: '1',
    icon: 'Target',
    title: 'Preciznost',
    description:
      'Svaki zahvat izvodimo sa najvišim stepenom pažnje i preciznosti, koristeći najsavremeniju opremu i tehnike.',
  },
  {
    id: '2',
    icon: 'ShieldCheck',
    title: 'Poverenje',
    description:
      'Gradimo dugoročne odnose sa pacijentima zasnovane na otvorenoj komunikaciji, iskrenosti i doslednosti.',
  },
  {
    id: '3',
    icon: 'Lightbulb',
    title: 'Inovacija',
    description:
      'Kontinuirano pratimo najnovija dostignuća u stomatologiji kako bismo pružali tretmane koji su efikasni i bezbolni.',
  },
  {
    id: '4',
    icon: 'HandHeart',
    title: 'Briga o pacijentu',
    description:
      'Svaki pacijent je jedinstven. Prilagođavamo pristup individualnim potrebama i brinemo o celokupnom iskustvu.',
  },
];

export default function AboutValues() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="section-kicker">Naše vrednosti</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Principi po kojima radimo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Svaki aspekt DENTALHOLIST pristupa je oblikovan vrednostima koje
            negujemo od prvog dana.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:gap-6">
          {VALUES.map((value, index) => {
            const IconComponent = getIcon(value.icon);
            return (
              <article
                key={value.id}
                className="group relative section-shell overflow-hidden p-7 transition-smooth hover:-translate-y-1 hover:shadow-hover-blue sm:p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 left-0 h-1 w-full gradient-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-soft">
                    <IconComponent className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
