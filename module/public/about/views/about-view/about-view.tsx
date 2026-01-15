'use client';

import type { Preloaded } from 'convex/react';
import { usePreloadedQuery } from 'convex/react';

import type { api } from '@/convex/_generated/api';
import AboutCta from '@/module/public/about/views/about-view/cta';
import AboutHero from '@/module/public/about/views/about-view/hero';
import AboutTeam from '@/module/public/about/views/about-view/team';
import AboutTimeline from '@/module/public/about/views/about-view/timeline';
import AboutValues from '@/module/public/about/views/about-view/values';

interface AboutViewProps {
  preloadedValues: Preloaded<typeof api.aboutValues.getActiveAboutValues>;
  preloadedMilestones: Preloaded<typeof api.milestones.getActiveMilestones>;
  preloadedTeamMembers: Preloaded<
    typeof api.teamMembers.getActiveTeamMembersWithImages
  >;
}

export function AboutView({
  preloadedValues,
  preloadedMilestones,
  preloadedTeamMembers,
}: AboutViewProps) {
  const values = usePreloadedQuery(preloadedValues);
  const milestones = usePreloadedQuery(preloadedMilestones);
  const teamMembers = usePreloadedQuery(preloadedTeamMembers);

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
