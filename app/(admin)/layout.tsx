import { AdminLayout } from '@/module/admin/components/admin-layout/admin-layout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
