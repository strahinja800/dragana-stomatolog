import { CheckCircle } from 'lucide-react';

import { SERVICES } from '@/constants/services';

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-card hover:shadow-hover-blue transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-3xl gradient-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-[rgb(13,162,231)]" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground py-2 mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-md leading-7 mb-4">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-[rgb(13,162,231)] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
