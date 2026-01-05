import { requireAdmin } from '@/module/auth/lib/auth-utils';

import { SettingsView } from './settings-view';

export default async function SettingsPage() {
  await requireAdmin('/admin/podesavanja');

  return <SettingsView />;
}
