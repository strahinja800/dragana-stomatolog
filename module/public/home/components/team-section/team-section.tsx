import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { team } from '@/data/data';

import TeamMembers from './team-members';

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[rgb(217,241,252)] text-[rgb(13,162,231)] text-sm font-medium mb-4">
            Naš tim
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Upoznajte naše stručnjake
          </h2>
          <p className="text-muted-foreground">
            Tim posvećenih profesionalaca sa dugogodišnjim iskustvom u
            stomatologiji.
          </p>
        </div>

        <TeamMembers team={team} />

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="default"
            className="text-lg px-8 py-6 border-[rgb(13,162,231)] hover:bg-[rgb(13,162,231)] text-[rgb(13,162,231)] rounded-3xl"
            asChild
          >
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
