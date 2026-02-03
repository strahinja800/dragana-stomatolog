import { AboutHeader } from '@/module/admin/about/views/about-header';
import { AboutNav } from '@/module/admin/about/views/about-nav';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export const metadata = {
  title: 'O Nama | Admin',
};

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin('/admin/o-nama');

  return (
    <div className="space-y-8">
      <AboutHeader />
      <div className="space-y-6">
        <AboutNav />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
