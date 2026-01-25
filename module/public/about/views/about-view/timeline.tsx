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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary-light) text-primary text-sm font-medium mb-4">
            Naša istorija
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Put do izvrsnosti
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={cn(
                  'relative flex items-start gap-8 mb-12',
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                <div
                  className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0`}
                >
                  <span className="text-primary font-heading font-bold text-2xl">
                    {milestone.year}
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-foreground mt-1">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    {milestone.description}
                  </p>
                </div>

                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-soft" />

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
