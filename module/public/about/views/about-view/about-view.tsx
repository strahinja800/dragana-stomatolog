'use client';

import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/lib/trpc';
import AboutCta from '@/module/public/about/views/about-view/cta';
import AboutHero from '@/module/public/about/views/about-view/hero';
import AboutTeam from '@/module/public/about/views/about-view/team';
import AboutTimeline from '@/module/public/about/views/about-view/timeline';
import AboutValues from '@/module/public/about/views/about-view/values';

export function AboutView() {
  const trpc = useTRPC();

  const { data: values = [] } = useQuery(
    trpc.about.getActiveAboutValues.queryOptions()
  );
  const { data: milestones = [] } = useQuery(
    trpc.about.getActiveMilestones.queryOptions()
  );
  const { data: teamMembers = [] } = useQuery(
    trpc.about.getActiveTeamMembers.queryOptions()
  );

  return (
    <>
      {/* Hero Section */}
      <AboutHero />

      {/* Values Section */}
      <AboutValues values={values} />

      {/* Team Section */}
      <AboutTeam teamMembers={teamMembers} />

      {/* Timeline Section */}
      <AboutTimeline milestones={milestones} />

      {/* CTA Section */}
      <AboutCta />
    </>
  );
}
