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

import type { TeamMember } from './team-members-table-columns';

interface TeamMembersTableRowActionsProps {
  member: TeamMember;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
}

export function TeamMembersTableRowActions({
  member,
  onEdit,
  onDelete,
  onToggleActive,
}: TeamMembersTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(member)}>
          <Edit className="mr-2 h-4 w-4" />
          Izmeni
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onToggleActive?.(member.id, member.isActive)}
        >
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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete?.(member.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Obriši
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
