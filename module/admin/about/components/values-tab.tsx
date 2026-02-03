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
import { AboutValueForm } from '@/module/admin/about/components/about-value-form';
import {
  type AboutValue,
  AboutValuesTable,
} from '@/module/admin/about/components/about-values-table/about-values-table';
import { useTRPC } from '@/trpc/client';

export function ValuesTab() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: values } = useSuspenseQuery(
    trpc.about.getAllAboutValues.queryOptions()
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null);
  const [deletingValueId, setDeletingValueId] = useState<string | null>(null);

  const { mutate: updateValue } = useMutation(
    trpc.about.updateAboutValue.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Vrednost uspešno ažurirana');
      },
      onError: () => toast.error('Greška pri ažuriranju vrednosti'),
    })
  );

  const { mutate: deleteValue } = useMutation(
    trpc.about.deleteAboutValue.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['about']] });
        toast.success('Vrednost uspešno obrisana');
        setDeletingValueId(null);
      },
      onError: () => toast.error('Greška pri brisanju vrednosti'),
    })
  );

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateValue({ id, isActive: !isActive });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Naše vrednosti</h2>
            <p className="text-sm text-muted-foreground">
              Vrednosti koje se prikazuju na stranici
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 size-4" />
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
              onToggleActive={handleToggleActive}
            />
          </CardContent>
        </Card>
      </div>

      <AboutValueForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {editingValue && (
        <AboutValueForm
          open={true}
          onClose={() => setEditingValue(null)}
          value={editingValue}
        />
      )}

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
    </>
  );
}
