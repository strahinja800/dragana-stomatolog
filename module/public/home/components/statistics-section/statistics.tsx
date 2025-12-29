import { STATISTICS } from '@/constants/stats';

export default function StatisticsSection() {
  return (
    <section className="py-6 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-4 md:gap-8">
          {STATISTICS.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border shadow-card"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
