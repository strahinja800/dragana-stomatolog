import { MilestonesSkeleton } from '@/module/admin/about/components/milestones-skeleton';
import { MilestonesTab } from '@/module/admin/about/components/milestones-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function MilestonesPage() {
  void prefetch(trpc.about.getAllMilestones.queryOptions());

  return (
    <HydrateClient loadingFallback={<MilestonesSkeleton />}>
      <MilestonesTab />
    </HydrateClient>
  );
}
