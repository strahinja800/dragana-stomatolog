'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';

import { TeamMembersTableRowActions } from './team-members-table-row-actions';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const teamMembersColumns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => <SortableHeader column={column} label="Redosled" />,
    cell: ({ row }) => <TableCellText value={row.getValue('sortOrder')} />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column} label="Ime" />,
    cell: ({ row }) => <TableCellText value={row.getValue('name')} />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <SortableHeader column={column} label="Pozicija" />,
    cell: ({ row }) => <TableCellText value={row.getValue('role')} />,
  },
  {
    accessorKey: 'specialty',
    header: 'Specijalizacija',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue('specialty') || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Aktivan' : 'Neaktivan'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      const isActive = row.getValue(id) as boolean;
      return value === 'active' ? isActive : !isActive;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const member = row.original;
      const meta = table.options.meta as {
        onEdit?: (member: TeamMember) => void;
        onDelete?: (id: string) => void;
        onToggleActive?: (id: string, isActive: boolean) => void;
      };
      return (
        <TeamMembersTableRowActions
          member={member}
          onEdit={meta?.onEdit}
          onDelete={meta?.onDelete}
          onToggleActive={meta?.onToggleActive}
        />
      );
    },
  },
];
