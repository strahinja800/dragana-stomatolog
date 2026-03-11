import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/constants/icons';
import { team } from '@/data/data';

import TeamMembers from './team-members';

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">Naš Tim</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            Stručnjaci kojima verujete
          </h2>
          <p className="mt-4 text-muted-foreground">
            Interdisciplinarni tim koji vodi terapiju od prvog pregleda do
            završne kontrole.
          </p>
        </div>

        <TeamMembers team={team} />

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full px-7">
            <Link href="/o-nama">
              Više o timu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
