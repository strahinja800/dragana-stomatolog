import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface AboutTimelineProps {
  milestones: Milestone[];
}

export default function AboutTimeline({ milestones }: AboutTimelineProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="section-kicker">Naša istorija</span>
          <h2 className="mt-5 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Put razvoja i poverenja
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Od skromnih početaka do tima od 7 specijalista, naš put je definisao
            svaki osmeh koji smo oblikovali.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-primary/10 md:left-1/2 md:-translate-x-px" />

            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={milestone.id}
                  className={cn(
                    'relative mb-12 last:mb-0 flex items-start',
                    'pl-16 md:pl-0',
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                >
                  <div className="absolute left-6 top-3 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <div className="absolute inset-0 rounded-full gradient-primary opacity-20" />
                      <div className="relative h-4 w-4 rounded-full gradient-primary shadow-soft" />
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex-1 md:w-[calc(50%-2rem)]',
                      isEven ? 'md:pr-14' : 'md:pl-14'
                    )}
                  >
                    <div
                      className={cn(
                        'section-shell p-6 transition-smooth hover:-translate-y-0.5 hover:shadow-hover-blue sm:p-7',
                        isEven ? 'md:text-right' : 'md:text-left'
                      )}
                    >
                      <div
                        className={cn(
                          'mb-3 flex items-center gap-3',
                          isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                        )}
                      >
                        <span className="inline-flex items-center rounded-full gradient-accent px-3.5 py-1 text-sm font-bold text-accent-foreground">
                          {milestone.year}
                        </span>
                        <div
                          className={cn(
                            'hidden h-px flex-1 md:block',
                            isEven
                              ? 'bg-gradient-to-l from-accent/40 to-transparent'
                              : 'bg-gradient-to-r from-accent/40 to-transparent'
                          )}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden flex-1 md:block" />
                </article>
              );
            })}

            <div className="absolute -bottom-2 left-6 z-10 -translate-x-1/2 md:left-1/2">
              <div className="h-3 w-3 rounded-full gradient-accent shadow-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
