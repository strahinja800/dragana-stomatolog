import { UnderConstruction } from '@/module/admin/shared/components/under-construction/under-construction';
import { requireAdmin } from '@/module/auth/lib/auth-utils';

export default async function KartoniPage() {
  await requireAdmin('/admin/kartoni');

  return <UnderConstruction title="Kartoni" />;
}
