import { ValuesSkeleton } from '@/module/admin/about/components/values-skeleton';
import { ValuesTab } from '@/module/admin/about/components/values-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function ValuesPage() {
  void prefetch(trpc.about.getAllAboutValues.queryOptions());

  return (
    <HydrateClient loadingFallback={<ValuesSkeleton />}>
      <ValuesTab />
    </HydrateClient>
  );
}
