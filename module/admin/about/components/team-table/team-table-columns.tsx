'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';
import { type Doc } from '@/convex/_generated/dataModel';

import { TeamTableRowActions } from './team-table-row-actions';

export type TeamMember = Doc<'teamMembers'>;

export interface TeamTableMeta {
  onEdit?: (member: TeamMember) => void;
}

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => <SortableHeader column={column} label="Redosled" />,
    cell: ({ row }) => <TableCellText value={row.getValue('sortOrder')} />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column} label="Ime" />,
    cell: ({ row }) => (
      <span className="ml-5 font-medium">{row.getValue('name')}</span>
    ),
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
      <span className="ml-5 text-muted-foreground">
        {row.getValue('specialty') || '—'}
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
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const member = row.original;
      const meta = table.options.meta as TeamTableMeta | undefined;
      return <TeamTableRowActions member={member} onEdit={meta?.onEdit} />;
    },
  },
];
