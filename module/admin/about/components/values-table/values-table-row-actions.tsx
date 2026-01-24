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

import { type Value } from './values-table-columns';

interface ValuesTableRowActionsProps {
  value: Value;
  onEdit?: (value: Value) => void;
}

export function ValuesTableRowActions({
  value,
  onEdit,
}: ValuesTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateValueFn = useConvexMutation(api.aboutValues.updateAboutValue);
  const { mutate: updateValue } = useMutation({
    mutationFn: updateValueFn,
    onSuccess: () => {
      toast.success('Vrednost uspešno ažurirana');
    },
    onError: (error) => {
      toast.error('Greška pri ažuriranju vrednosti');
      console.error(error);
    },
  });

  const deleteValueFn = useConvexMutation(api.aboutValues.deleteAboutValue);
  const { mutate: deleteValue } = useMutation({
    mutationFn: deleteValueFn,
    onSuccess: () => {
      toast.success('Vrednost uspešno obrisana');
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error('Greška pri brisanju vrednosti');
      console.error(error);
    },
  });

  const handleToggleActive = () => {
    updateValue({ id: value._id, isActive: !value.isActive });
  };

  const handleDelete = () => {
    deleteValue({ id: value._id });
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
            {value.isActive ? (
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
          <DropdownMenuItem onClick={() => onEdit?.(value)}>
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
        description="Ova akcija ne može biti poništena. Vrednost će biti trajno obrisana."
        confirmText="Obriši"
        cancelText="Otkaži"
        variant="destructive"
      />
    </>
  );
}
