import { ServiceTypesSkeleton } from '@/module/admin/podesavanja/components/service-types-skeleton';
import { ServiceTypesTab } from '@/module/admin/podesavanja/components/service-types-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function ServiceTypesPage() {
  void prefetch(trpc.settings.getServiceTypes.queryOptions());

  return (
    <HydrateClient loadingFallback={<ServiceTypesSkeleton />}>
      <ServiceTypesTab />
    </HydrateClient>
  );
}
