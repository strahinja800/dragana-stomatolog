'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

import { TeamMemberForm } from './team-member-form';

interface TeamMember {
  _id: Id<'teamMembers'>;
  name: string;
  role: string;
  specialty?: string;
  bio?: string;
  imageStorageId?: Id<'_storage'>;
  imageAlt?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface TeamMembersTableProps {
  members: TeamMember[];
}

export function TeamMembersTable({ members }: TeamMembersTableProps) {
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingId, setDeletingId] = useState<Id<'teamMembers'> | null>(null);
  const updateMember = useMutation(api.teamMembers.updateTeamMember);
  const deleteMember = useMutation(api.teamMembers.deleteTeamMember);

  const handleToggleActive = async (
    id: Id<'teamMembers'>,
    currentState: boolean
  ) => {
    await updateMember({ id, isActive: !currentState });
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMember({ id: deletingId });
      toast.success('Član tima uspešno obrisan');
      setDeletingId(null);
    } catch (error) {
      toast.error('Greška pri brisanju člana tima');
      console.error(error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15">Redosled</TableHead>
            <TableHead>Ime</TableHead>
            <TableHead>Pozicija</TableHead>
            <TableHead>Specijalizacija</TableHead>
            <TableHead className="w-25">Status</TableHead>
            <TableHead className="w-30 text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                Nema članova tima. Kliknite "Dodaj člana tima" da dodate prvog.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow
                key={member._id}
                className={cn(!member.isActive && 'opacity-50')}
              >
                <TableCell className="font-medium">
                  {member.sortOrder}
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-muted-foreground">
                  {member.specialty || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={member.isActive ? 'default' : 'secondary'}>
                    {member.isActive ? 'Aktivan' : 'Neaktivan'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleToggleActive(member._id, member.isActive)
                      }
                      title={member.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                    >
                      {member.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingMember(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(member._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editingMember && (
        <TeamMemberForm
          open={true}
          onClose={() => setEditingMember(null)}
          member={editingMember}
        />
      )}

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Da li ste sigurni?"
        description="Ova akcija ne može biti poništena. Član tima će biti trajno obrisan."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </>
  );
}
