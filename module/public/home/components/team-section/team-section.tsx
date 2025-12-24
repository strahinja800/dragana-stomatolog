import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { team } from "@/data/data";

export default function TeamSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium mb-4">
            Naš tim
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Upoznajte naše stručnjake
          </h2>
          <p className="text-muted-foreground">
            Tim posvećenih profesionalaca sa dugogodišnjim iskustvom u stomatologiji.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="aspect-3/4 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-foreground/90 via-foreground/60 to-transparent p-6">
                <h3 className="text-lg font-heading font-semibold text-primary-foreground">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
                <p className="text-primary-foreground/70 text-sm">{member.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero-outline" size="lg" className="text-lg px-8 py-6 border-[rgb(13,162,231)] hover:bg-[rgb(13,162,231)] text-[rgb(13,162,231)] rounded-3xl" asChild>
            <Link href="/o-nama">
              Više o timu
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
