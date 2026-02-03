import { TeamMembersSkeleton } from '@/module/admin/about/components/team-members-skeleton';
import { TeamMembersTab } from '@/module/admin/about/components/team-members-tab';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default function TeamMembersPage() {
  void prefetch(trpc.about.getAllTeamMembers.queryOptions());

  return (
    <HydrateClient loadingFallback={<TeamMembersSkeleton />}>
      <TeamMembersTab />
    </HydrateClient>
  );
}
