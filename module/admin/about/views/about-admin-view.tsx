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
import { AboutValuesTable } from '@/module/admin/about/components/about-values-table';
import { MilestoneForm } from '@/module/admin/about/components/milestone-form';
import { MilestonesTable } from '@/module/admin/about/components/milestones-table';
import { TeamMemberForm } from '@/module/admin/about/components/team-member-form';
import { TeamMembersTable } from '@/module/admin/about/components/team-members-table';

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
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);
  const [isTeamMemberFormOpen, setIsTeamMemberFormOpen] = useState(false);

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
              <AboutValuesTable values={values} />
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
              Dodaj milestone
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Svi milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestonesTable milestones={milestones} />
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
              <TeamMembersTable members={teamMembers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AboutValueForm
        open={isValueFormOpen}
        onClose={() => setIsValueFormOpen(false)}
      />

      <MilestoneForm
        open={isMilestoneFormOpen}
        onClose={() => setIsMilestoneFormOpen(false)}
      />

      <TeamMemberForm
        open={isTeamMemberFormOpen}
        onClose={() => setIsTeamMemberFormOpen(false)}
      />
    </div>
  );
}
