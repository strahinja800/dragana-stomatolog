import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { SettingsView } from '@/module/admin/podesavanja/views/settings-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function SettingsPage() {
  await requireAdmin('/admin/podesavanja');

  const [
    preloadedWorkingHours,
    preloadedNonWorkingDays,
    preloadedServiceTypes,
  ] = await Promise.all([
    preloadQuery(api.settings.getWorkingHours),
    preloadQuery(api.settings.getNonWorkingDays, {}),
    preloadQuery(api.settings.getServiceTypes, {}),
  ]);

  return (
    <SettingsView
      preloadedWorkingHours={preloadedWorkingHours}
      preloadedNonWorkingDays={preloadedNonWorkingDays}
      preloadedServiceTypes={preloadedServiceTypes}
    />
  );
}
