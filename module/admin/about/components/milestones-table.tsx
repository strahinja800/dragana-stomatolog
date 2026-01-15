'use client';

import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
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

import { MilestoneForm } from './milestone-form';

interface Milestone {
  _id: Id<'milestones'>;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface MilestonesTableProps {
  milestones: Milestone[];
}

export function MilestonesTable({ milestones }: MilestonesTableProps) {
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<Id<'milestones'> | null>(null);

  const updateMilestoneFn = useConvexMutation(api.milestones.updateMilestone);
  const { mutate: updateMilestone } = useMutation({
    mutationFn: updateMilestoneFn,
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
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error('Greška pri brisanju milestone-a');
      console.error(error);
    },
  });

  const handleToggleActive = (id: Id<'milestones'>, currentState: boolean) => {
    updateMilestone({ id, isActive: !currentState });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteMilestone({ id: deletingId });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15">Redosled</TableHead>
            <TableHead className="w-25">Godina</TableHead>
            <TableHead>Naslov</TableHead>
            <TableHead>Opis</TableHead>
            <TableHead className="w-25">Status</TableHead>
            <TableHead className="w-30 text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {milestones.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                Nema milestones. Kliknite "Dodaj milestone" da dodate prvi.
              </TableCell>
            </TableRow>
          ) : (
            milestones.map((milestone) => (
              <TableRow
                key={milestone._id}
                className={cn(!milestone.isActive && 'opacity-50')}
              >
                <TableCell className="font-medium">
                  {milestone.sortOrder}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {milestone.year}
                </TableCell>
                <TableCell className="font-medium">{milestone.title}</TableCell>
                <TableCell className="max-w-md truncate">
                  {milestone.description}
                </TableCell>
                <TableCell>
                  <Badge variant={milestone.isActive ? 'default' : 'secondary'}>
                    {milestone.isActive ? 'Aktivan' : 'Neaktivan'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleToggleActive(milestone._id, milestone.isActive)
                      }
                      title={milestone.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                    >
                      {milestone.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingMilestone(milestone)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(milestone._id)}
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

      {editingMilestone && (
        <MilestoneForm
          open={true}
          onClose={() => setEditingMilestone(null)}
          milestone={editingMilestone}
        />
      )}

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
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
