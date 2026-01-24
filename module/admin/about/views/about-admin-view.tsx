'use client';

import { useState } from 'react';

import type { Preloaded } from 'convex/react';
import { usePreloadedQuery } from 'convex/react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { api } from '@/convex/_generated/api';
import { AboutValueForm } from '@/module/admin/about/components/about-value-form';
import { MilestoneForm } from '@/module/admin/about/components/milestone-form';
import { MilestonesTable } from '@/module/admin/about/components/milestones-table/milestones-table';
import type { Milestone } from '@/module/admin/about/components/milestones-table/milestones-table-columns';
import { TeamMemberForm } from '@/module/admin/about/components/team-member-form';
import { TeamTable } from '@/module/admin/about/components/team-table/team-table';
import type { TeamMember } from '@/module/admin/about/components/team-table/team-table-columns';
import { ValuesTable } from '@/module/admin/about/components/values-table/values-table';
import type { Value } from '@/module/admin/about/components/values-table/values-table-columns';

interface AboutAdminViewProps {
  preloadedValues: Preloaded<typeof api.aboutValues.getAllAboutValues>;
  preloadedMilestones: Preloaded<typeof api.milestones.getAllMilestones>;
  preloadedTeamMembers: Preloaded<typeof api.teamMembers.getAllTeamMembers>;
}

export function AboutAdminView({
  preloadedValues,
  preloadedMilestones,
  preloadedTeamMembers,
}: AboutAdminViewProps) {
  const values = usePreloadedQuery(preloadedValues);
  const milestones = usePreloadedQuery(preloadedMilestones);
  const teamMembers = usePreloadedQuery(preloadedTeamMembers);

  const [isValueFormOpen, setIsValueFormOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<Value | null>(null);

  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );

  const [isTeamMemberFormOpen, setIsTeamMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">O Nama</h1>
        <p className="text-muted-foreground mt-1">
          Upravljajte sadržajem koji se prikazuje na "O Nama" stranici
        </p>
      </div>

      <Tabs defaultValue="values" className="space-y-6">
        <TabsList>
          <TabsTrigger value="values">Vrednosti</TabsTrigger>
          <TabsTrigger value="history">Istorija</TabsTrigger>
          <TabsTrigger value="team">Tim</TabsTrigger>
        </TabsList>

        <TabsContent value="values" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Naše vrednosti</h2>
              <p className="text-sm text-muted-foreground">
                Vrednosti koje se prikazuju na stranici
              </p>
            </div>
            <Button onClick={() => setIsValueFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj vrednost
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sve vrednosti</CardTitle>
            </CardHeader>
            <CardContent>
              <ValuesTable data={values} onEditValue={setEditingValue} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Naša istorija</h2>
              <p className="text-sm text-muted-foreground">
                Važni događaji koji se prikazuju na timeline-u
              </p>
            </div>
            <Button onClick={() => setIsMilestoneFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj postignuće
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sva postignuća</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestonesTable
                data={milestones}
                onEditMilestone={setEditingMilestone}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Naš tim</h2>
              <p className="text-sm text-muted-foreground">
                Članovi tima koji se prikazuju na stranici
              </p>
            </div>
            <Button onClick={() => setIsTeamMemberFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj člana tima
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Svi članovi tima</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamTable data={teamMembers} onEditMember={setEditingMember} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AboutValueForm
        open={isValueFormOpen || !!editingValue}
        onClose={() => {
          setIsValueFormOpen(false);
          setEditingValue(null);
        }}
        value={editingValue ?? undefined}
      />

      <MilestoneForm
        open={isMilestoneFormOpen || !!editingMilestone}
        onClose={() => {
          setIsMilestoneFormOpen(false);
          setEditingMilestone(null);
        }}
        milestone={editingMilestone ?? undefined}
      />

      <TeamMemberForm
        open={isTeamMemberFormOpen || !!editingMember}
        onClose={() => {
          setIsTeamMemberFormOpen(false);
          setEditingMember(null);
        }}
        member={editingMember ?? undefined}
      />
    </div>
  );
}
