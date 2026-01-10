import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { SettingsView } from '@/module/admin/podesavanja/views/settings-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function SettingsPage() {
  await requireAdmin('/admin/podesavanja');

  const preloadedWorkingHours = await preloadQuery(api.settings.getWorkingHours);

  return <SettingsView preloadedWorkingHours={preloadedWorkingHours} />;
}
