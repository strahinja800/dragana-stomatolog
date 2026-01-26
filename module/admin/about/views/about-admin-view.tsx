'use client';

import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AboutValueForm } from '@/module/admin/about/components/about-value-form';
import {
  type AboutValue,
  AboutValuesTable,
} from '@/module/admin/about/components/about-values-table/about-values-table';
import { MilestoneForm } from '@/module/admin/about/components/milestone-form';
import {
  type Milestone,
  MilestonesTable,
} from '@/module/admin/about/components/milestones-table/milestones-table';
import { TeamMemberForm } from '@/module/admin/about/components/team-member-form';
import {
  type TeamMember,
  TeamMembersTable,
} from '@/module/admin/about/components/team-members-table/team-members-table';
import { useTRPC } from '@/trpc/client';

export function AboutAdminView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: values = [] } = useQuery(
    trpc.about.getAllAboutValues.queryOptions()
  );
  const { data: milestones = [] } = useQuery(
    trpc.about.getAllMilestones.queryOptions()
  );
  const { data: teamMembers = [] } = useQuery(
    trpc.about.getAllTeamMembers.queryOptions()
  );

  // Form states
  const [isValueFormOpen, setIsValueFormOpen] = useState(false);
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);
  const [isTeamMemberFormOpen, setIsTeamMemberFormOpen] = useState(false);

  // Edit states
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Delete states
  const [deletingValueId, setDeletingValueId] = useState<string | null>(null);
  const [deletingMilestoneId, setDeletingMilestoneId] = useState<string | null>(
    null
  );
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  // About Values mutations
  const { mutate: updateValue } = useMutation(
    trpc.about.updateAboutValue.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Vrednost uspešno ažurirana');
      },
      onError: () => toast.error('Greška pri ažuriranju vrednosti'),
    })
  );

  const { mutate: deleteValue } = useMutation(
    trpc.about.deleteAboutValue.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Vrednost uspešno obrisana');
        setDeletingValueId(null);
      },
      onError: () => toast.error('Greška pri brisanju vrednosti'),
    })
  );

  // Milestones mutations
  const { mutate: updateMilestone } = useMutation(
    trpc.about.updateMilestone.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Postignuće uspešno ažurirano');
      },
      onError: () => toast.error('Greška pri ažuriranju postignuća'),
    })
  );

  const { mutate: deleteMilestone } = useMutation(
    trpc.about.deleteMilestone.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Postignuće uspešno obrisano');
        setDeletingMilestoneId(null);
      },
      onError: () => toast.error('Greška pri brisanju postignuća'),
    })
  );

  // Team Members mutations
  const { mutate: updateMember } = useMutation(
    trpc.about.updateTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Član tima uspešno ažuriran');
      },
      onError: () => toast.error('Greška pri ažuriranju člana tima'),
    })
  );

  const { mutate: deleteMember } = useMutation(
    trpc.about.deleteTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['about'] });
        toast.success('Član tima uspešno obrisan');
        setDeletingMemberId(null);
      },
      onError: () => toast.error('Greška pri brisanju člana tima'),
    })
  );

  // Handlers
  const handleToggleValueActive = (id: string, isActive: boolean) => {
    updateValue({ id, isActive: !isActive });
  };

  const handleToggleMilestoneActive = (id: string, isActive: boolean) => {
    updateMilestone({ id, isActive: !isActive });
  };

  const handleToggleMemberActive = (id: string, isActive: boolean) => {
    updateMember({ id, isActive: !isActive });
  };

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
              <AboutValuesTable
                data={values}
                onEdit={setEditingValue}
                onDelete={setDeletingValueId}
                onToggleActive={handleToggleValueActive}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Naša postignuća</h2>
              <p className="text-sm text-muted-foreground">
                Važni događaji i postignuća koji se prikazuju na timeline-u
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
                onEdit={setEditingMilestone}
                onDelete={setDeletingMilestoneId}
                onToggleActive={handleToggleMilestoneActive}
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
              <TeamMembersTable
                data={teamMembers}
                onEdit={setEditingMember}
                onDelete={setDeletingMemberId}
                onToggleActive={handleToggleMemberActive}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forms for creating new items */}
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

      {/* Forms for editing items */}
      {editingValue && (
        <AboutValueForm
          open={true}
          onClose={() => setEditingValue(null)}
          value={editingValue}
        />
      )}

      {editingMilestone && (
        <MilestoneForm
          open={true}
          onClose={() => setEditingMilestone(null)}
          milestone={editingMilestone}
        />
      )}

      {editingMember && (
        <TeamMemberForm
          open={true}
          onClose={() => setEditingMember(null)}
          member={editingMember}
        />
      )}

      {/* Delete confirmation dialogs */}
      <ConfirmDialog
        open={!!deletingValueId}
        onOpenChange={(open) => !open && setDeletingValueId(null)}
        onConfirm={() =>
          deletingValueId && deleteValue({ id: deletingValueId })
        }
        title="Da li ste sigurni?"
        description="Ova akcija ne može biti poništena. Vrednost će biti trajno obrisana."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />

      <ConfirmDialog
        open={!!deletingMilestoneId}
        onOpenChange={(open) => !open && setDeletingMilestoneId(null)}
        onConfirm={() =>
          deletingMilestoneId && deleteMilestone({ id: deletingMilestoneId })
        }
        title="Da li ste sigurni?"
        description="Ova akcija ne može biti poništena. Postignuće će biti trajno obrisano."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />

      <ConfirmDialog
        open={!!deletingMemberId}
        onOpenChange={(open) => !open && setDeletingMemberId(null)}
        onConfirm={() =>
          deletingMemberId && deleteMember({ id: deletingMemberId })
        }
        title="Da li ste sigurni?"
        description="Ova akcija ne može biti poništena. Član tima će biti trajno obrisan."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </div>
  );
}
