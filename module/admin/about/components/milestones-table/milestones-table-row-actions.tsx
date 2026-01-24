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

import { type Milestone } from './milestones-table-columns';

interface MilestonesTableRowActionsProps {
  milestone: Milestone;
  onEdit?: (milestone: Milestone) => void;
}

export function MilestonesTableRowActions({
  milestone,
  onEdit,
}: MilestonesTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateMilestoneFn = useConvexMutation(api.milestones.updateMilestone);
  const { mutate: updateMilestone } = useMutation({
    mutationFn: updateMilestoneFn,
    onSuccess: () => {
      toast.success('Milestone uspešno ažuriran');
    },
    onError: (error) => {
      toast.error('Greška pri ažuriranju milestone-a');
      console.error(error);
    },
  });

  const deleteMilestoneFn = useConvexMutation(api.milestones.deleteMilestone);
  const { mutate: deleteMilestone } = useMutation({
    mutationFn: deleteMilestoneFn,
    onSuccess: () => {
      toast.success('Milestone uspešno obrisan');
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error('Greška pri brisanju milestone-a');
      console.error(error);
    },
  });

  const handleToggleActive = () => {
    updateMilestone({ id: milestone._id, isActive: !milestone.isActive });
  };

  const handleDelete = () => {
    deleteMilestone({ id: milestone._id });
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
            {milestone.isActive ? (
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
          <DropdownMenuItem onClick={() => onEdit?.(milestone)}>
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
        description="Ova akcija ne može biti poništena. Milestone će biti trajno obrisan."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </>
  );
}
