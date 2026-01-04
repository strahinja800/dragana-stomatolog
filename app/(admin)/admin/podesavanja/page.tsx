import { requireAdmin } from '@/module/auth/lib/auth-utils';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

import { SettingsView } from './settings-view';

export default async function SettingsPage() {
  await requireAdmin('/admin/podesavanja');

  // Prefetch all settings data
  prefetch(trpc.settings.getWorkingHours.queryOptions());
  prefetch(trpc.settings.getNonWorkingDays.queryOptions({}));
  prefetch(trpc.settings.getServiceTypes.queryOptions());

  return (
    <HydrateClient>
      <SettingsView />
    </HydrateClient>
  );
}
