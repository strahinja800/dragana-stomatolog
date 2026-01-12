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
import { AboutValueForm } from '@/module/admin/about/components/about-value-form';

interface AboutValue {
  _id: Id<'aboutValues'>;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AboutValuesTableProps {
  values: AboutValue[];
}

export function AboutValuesTable({ values }: AboutValuesTableProps) {
  const [editingValue, setEditingValue] = useState<AboutValue | null>(null);
  const [deletingId, setDeletingId] = useState<Id<'aboutValues'> | null>(null);
  const updateValue = useMutation(api.aboutValues.updateAboutValue);
  const deleteValue = useMutation(api.aboutValues.deleteAboutValue);

  const handleToggleActive = async (
    id: Id<'aboutValues'>,
    currentState: boolean
  ) => {
    await updateValue({ id, isActive: !currentState });
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteValue({ id: deletingId });
      toast.success('Vrednost uspešno obrisana');
      setDeletingId(null);
    } catch (error) {
      toast.error('Greška pri brisanju vrednosti');
      console.error(error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15">Redosled</TableHead>
            <TableHead className="w-25">Ikona</TableHead>
            <TableHead>Naslov</TableHead>
            <TableHead>Opis</TableHead>
            <TableHead className="w-25">Status</TableHead>
            <TableHead className="w-30 text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                Nema vrednosti. Kliknite "Dodaj vrednost" da dodate prvu.
              </TableCell>
            </TableRow>
          ) : (
            values.map((value) => (
              <TableRow
                key={value._id}
                className={cn(!value.isActive && 'opacity-50')}
              >
                <TableCell className="font-medium">{value.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{value.icon}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{value.title}</TableCell>
                <TableCell className="max-w-md truncate">
                  {value.description}
                </TableCell>
                <TableCell>
                  <Badge variant={value.isActive ? 'default' : 'secondary'}>
                    {value.isActive ? 'Aktivna' : 'Neaktivna'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleToggleActive(value._id, value.isActive)
                      }
                      title={value.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                    >
                      {value.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingValue(value)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(value._id)}
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

      {editingValue && (
        <AboutValueForm
          open={true}
          onClose={() => setEditingValue(null)}
          value={editingValue}
        />
      )}

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Da li ste sigurni?"
        description="Ova akcija ne može biti poništena. Vrednost će biti trajno obrisana."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </>
  );
}
