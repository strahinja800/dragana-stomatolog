'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';

import { MilestonesTableRowActions } from './milestones-table-row-actions';

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const milestonesColumns: ColumnDef<Milestone>[] = [
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => <SortableHeader column={column} label="Redosled" />,
    cell: ({ row }) => <TableCellText value={row.getValue('sortOrder')} />,
  },
  {
    accessorKey: 'year',
    header: ({ column }) => <SortableHeader column={column} label="Godina" />,
    cell: ({ row }) => (
      <span className="font-semibold text-primary">{row.getValue('year')}</span>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableHeader column={column} label="Naslov" />,
    cell: ({ row }) => <TableCellText value={row.getValue('title')} />,
  },
  {
    accessorKey: 'description',
    header: 'Opis',
    cell: ({ row }) => (
      <span className="max-w-md truncate block">
        {row.getValue('description')}
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
          {isActive ? 'Aktivno' : 'Neaktivno'}
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
      const milestone = row.original;
      const meta = table.options.meta as {
        onEdit?: (milestone: Milestone) => void;
        onDelete?: (id: string) => void;
        onToggleActive?: (id: string, isActive: boolean) => void;
      };
      return (
        <MilestonesTableRowActions
          milestone={milestone}
          onEdit={meta?.onEdit}
          onDelete={meta?.onDelete}
          onToggleActive={meta?.onToggleActive}
        />
      );
    },
  },
];
