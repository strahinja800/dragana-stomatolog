import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { AboutAdminView } from '@/module/admin/about/views/about-admin-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function AboutAdminPage() {
  await requireAdmin('/admin/o-nama');

  const preloadedValues = await preloadQuery(api.aboutValues.getAllAboutValues);
  const preloadedMilestones = await preloadQuery(
    api.milestones.getAllMilestones
  );

  return (
    <AboutAdminView
      preloadedValues={preloadedValues}
      preloadedMilestones={preloadedMilestones}
    />
  );
}
