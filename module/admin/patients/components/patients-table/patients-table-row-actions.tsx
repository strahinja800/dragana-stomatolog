'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Trash2 } from '@/constants/icons';

import { type Patient } from './patients-table-columns';

interface PatientsTableRowActionsProps {
  patient: Patient;
  onDelete?: (id: string) => void;
}

export function PatientsTableRowActions({
  patient,
  onDelete,
}: PatientsTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/patients/${patient.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Pogledaj
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete?.(patient.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Obriši
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
