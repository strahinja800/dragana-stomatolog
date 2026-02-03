'use client';

import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMemberForm } from '@/module/admin/about/components/team-member-form';
import {
  type TeamMember,
  TeamMembersTable,
} from '@/module/admin/about/components/team-members-table/team-members-table';
import { useTRPC } from '@/trpc/client';

export function TeamMembersTab() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: teamMembers } = useSuspenseQuery(
    trpc.about.getAllTeamMembers.queryOptions()
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const { mutate: updateMember } = useMutation(
    trpc.about.updateTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Član tima uspešno ažuriran');
      },
      onError: () => toast.error('Greška pri ažuriranju člana tima'),
    })
  );

  const { mutate: deleteMember } = useMutation(
    trpc.about.deleteTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Član tima uspešno obrisan');
        setDeletingMemberId(null);
      },
      onError: () => toast.error('Greška pri brisanju člana tima'),
    })
  );

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateMember({ id, isActive: !isActive });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Naš tim</h2>
            <p className="text-sm text-muted-foreground">
              Članovi tima koji se prikazuju na stranici
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 size-4" />
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
              onToggleActive={handleToggleActive}
            />
          </CardContent>
        </Card>
      </div>

      <TeamMemberForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {editingMember && (
        <TeamMemberForm
          open={true}
          onClose={() => setEditingMember(null)}
          member={editingMember}
        />
      )}

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
    </>
  );
}
