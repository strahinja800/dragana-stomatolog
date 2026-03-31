import { SettingsHeader } from '@/module/admin/podesavanja/views/settings-header';
import { SettingsNav } from '@/module/admin/podesavanja/views/settings-nav';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export const metadata = {
  title: 'Podešavanja | Admin',
};

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin('/admin/settings');

  return (
    <div className="space-y-8">
      <SettingsHeader />
      <div className="space-y-6">
        <SettingsNav />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
