'use client';

import { useState } from 'react';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from '@/constants/icons';
import { MilestoneForm } from '@/module/admin/about/components/milestone-form';
import {
  type Milestone,
  MilestonesTable,
} from '@/module/admin/about/components/milestones-table/milestones-table';
import { useTRPC } from '@/trpc/client';

export function MilestonesTab() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: milestones } = useSuspenseQuery(
    trpc.about.getAllMilestones.queryOptions()
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [deletingMilestoneId, setDeletingMilestoneId] = useState<string | null>(
    null
  );

  const { mutate: updateMilestone } = useMutation(
    trpc.about.updateMilestone.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Postignuće uspešno ažurirano');
      },
      onError: () => toast.error('Greška pri ažuriranju postignuća'),
    })
  );

  const { mutate: deleteMilestone } = useMutation(
    trpc.about.deleteMilestone.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Postignuće uspešno obrisano');
        setDeletingMilestoneId(null);
      },
      onError: () => toast.error('Greška pri brisanju postignuća'),
    })
  );

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateMilestone({ id, isActive: !isActive });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Naša postignuća</h2>
            <p className="text-sm text-muted-foreground">
              Važni događaji i postignuća koji se prikazuju na timeline-u
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 size-4" />
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
              onToggleActive={handleToggleActive}
            />
          </CardContent>
        </Card>
      </div>

      <MilestoneForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {editingMilestone && (
        <MilestoneForm
          open={true}
          onClose={() => setEditingMilestone(null)}
          milestone={editingMilestone}
        />
      )}

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
    </>
  );
}
