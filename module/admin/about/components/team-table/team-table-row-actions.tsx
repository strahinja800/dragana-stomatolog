'use client';

import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';

import { type TeamMember } from './team-table-columns';

interface TeamTableRowActionsProps {
  member: TeamMember;
  onEdit?: (member: TeamMember) => void;
}

export function TeamTableRowActions({
  member,
  onEdit,
}: TeamTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateMemberFn = useConvexMutation(api.teamMembers.updateTeamMember);
  const { mutate: updateMember } = useMutation({
    mutationFn: updateMemberFn,
    onSuccess: () => {
      toast.success('Član tima uspešno ažuriran');
    },
    onError: (error) => {
      toast.error('Greška pri ažuriranju člana tima');
      console.error(error);
    },
  });

  const deleteMemberFn = useConvexMutation(api.teamMembers.deleteTeamMember);
  const { mutate: deleteMember } = useMutation({
    mutationFn: deleteMemberFn,
    onSuccess: () => {
      toast.success('Član tima uspešno obrisan');
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error('Greška pri brisanju člana tima');
      console.error(error);
    },
  });

  const handleToggleActive = () => {
    updateMember({ id: member._id, isActive: !member.isActive });
  };

  const handleDelete = () => {
    deleteMember({ id: member._id });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Otvori meni</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleToggleActive}>
            {member.isActive ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Deaktiviraj
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Aktiviraj
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(member)}>
            <Edit className="mr-2 h-4 w-4" />
            Izmeni
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Obriši
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
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
