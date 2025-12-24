import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { portfolioItems } from "@/data/data";

export default function PortfolioSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[rgb(13,162,231)]" />
              <span className="text-[rgb(13,162,231)] font-medium text-base uppercase tracking-wider">
                Naš Portfolio
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              Vrhunska stomatološka<br />oprema i usluge
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md lg:text-right text-base">
            Koristimo najsavremeniju opremu i tehnologije za postizanje najboljih rezultata u lečenju i nezi vaših zuba.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-[rgba(2, 255, 255, 0.5)] border border-border p-7 hover:shadow-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card text-foreground font-heading font-bold text-xl shadow-card">
                  {item.number}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>

              {/* 3D Image */}
              <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero-outline" size="lg" className="text-lg px-8 py-6 border-[rgb(13,162,231)] hover:bg-[rgb(13,162,231)] text-[rgb(13,162,231)] rounded-3xl" asChild>
            <Link href="/usluge">
              Pogledaj sve usluge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
