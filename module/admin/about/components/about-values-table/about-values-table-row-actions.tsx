'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from '@/constants/icons';

import type { AboutValue } from './about-values-table-columns';

interface AboutValuesTableRowActionsProps {
  value: AboutValue;
  onEdit?: (value: AboutValue) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
}

export function AboutValuesTableRowActions({
  value,
  onEdit,
  onDelete,
  onToggleActive,
}: AboutValuesTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(value)}>
          <Edit className="mr-2 h-4 w-4" />
          Izmeni
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onToggleActive?.(value.id, value.isActive)}
        >
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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete?.(value.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Obriši
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
