'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';
import { type Doc } from '@/convex/_generated/dataModel';

import { ValuesTableRowActions } from './values-table-row-actions';

export type Value = Doc<'aboutValues'>;

export interface ValuesTableMeta {
  onEdit?: (value: Value) => void;
}

export const columns: ColumnDef<Value>[] = [
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => <SortableHeader column={column} label="Redosled" />,
    cell: ({ row }) => <TableCellText value={row.getValue('sortOrder')} />,
  },
  {
    accessorKey: 'icon',
    header: 'Ikona',
    cell: ({ row }) => (
      <span className="ml-5 font-mono text-sm">{row.getValue('icon')}</span>
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
          {isActive ? 'Aktivna' : 'Neaktivna'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const value = row.original;
      const meta = table.options.meta as ValuesTableMeta | undefined;
      return <ValuesTableRowActions value={value} onEdit={meta?.onEdit} />;
    },
  },
];
