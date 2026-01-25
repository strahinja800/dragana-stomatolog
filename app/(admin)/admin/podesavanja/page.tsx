import { SettingsView } from '@/module/admin/podesavanja/views/settings-view';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export const metadata = {
  title: 'Podešavanja | Admin',
};

export default async function SettingsPage() {
  await requireAdmin('/admin/podesavanja');

  return <SettingsView />;
}
