import { getIcon } from '@/module/public/about/lib/icon-map';

interface AboutValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface AboutValuesProps {
  values: AboutValue[];
}

export default function AboutValues({ values }: AboutValuesProps) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary-light) text-primary text-sm font-medium mb-4">
            Naše vrednosti
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Šta nas čini posebnim
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const IconComponent = getIcon(value.icon);
            return (
              <div
                key={value.id}
                className="p-6 rounded-2xl bg-card border border-border shadow-card text-center"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-5">
                  <IconComponent className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
