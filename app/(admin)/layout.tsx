import { AdminLayout } from '@/module/admin/shared/components/admin-layout/admin-layout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
