'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';
import { type Doc } from '@/convex/_generated/dataModel';

import { MilestonesTableRowActions } from './milestones-table-row-actions';

export type Milestone = Doc<'milestones'>;

export interface MilestonesTableMeta {
  onEdit?: (milestone: Milestone) => void;
}

export const columns: ColumnDef<Milestone>[] = [
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => <SortableHeader column={column} label="Redosled" />,
    cell: ({ row }) => <TableCellText value={row.getValue('sortOrder')} />,
  },
  {
    accessorKey: 'year',
    header: ({ column }) => <SortableHeader column={column} label="Godina" />,
    cell: ({ row }) => (
      <span className="ml-5 font-semibold text-primary">
        {row.getValue('year')}
      </span>
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
      <span className="ml-5 block max-w-md truncate text-muted-foreground">
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
          {isActive ? 'Aktivan' : 'Neaktivan'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const milestone = row.original;
      const meta = table.options.meta as MilestonesTableMeta | undefined;
      return (
        <MilestonesTableRowActions
          milestone={milestone}
          onEdit={meta?.onEdit}
        />
      );
    },
  },
];
