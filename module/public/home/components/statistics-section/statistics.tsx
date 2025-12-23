import { CheckCircle, Clock, Heart, Star } from "lucide-react";

const stats = [
  { icon: CheckCircle, value: "15+", label: "Godina iskustva" },
  { icon: Heart, value: "10,000+", label: "Zadovoljnih pacijenata" },
  { icon: Star, value: "5.0", label: "Prosečna ocena" },
  { icon: Clock, value: "24/7", label: "Podrška pacijentima" },
];

export default function StatisticsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
