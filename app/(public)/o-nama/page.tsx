import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { AboutView } from '@/module/public/about/views/about-view/about-view';

export default async function AboutPage() {
  const preloadedValues = await preloadQuery(
    api.aboutValues.getActiveAboutValues
  );
  const preloadedMilestones = await preloadQuery(
    api.milestones.getActiveMilestones
  );
  const preloadedTeamMembers = await preloadQuery(
    api.teamMembers.getActiveTeamMembersWithImages
  );

  return (
    <AboutView
      preloadedValues={preloadedValues}
      preloadedMilestones={preloadedMilestones}
      preloadedTeamMembers={preloadedTeamMembers}
    />
  );
}
