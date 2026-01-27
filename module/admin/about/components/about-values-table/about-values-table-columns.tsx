'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';

import { AboutValuesTableRowActions } from './about-values-table-row-actions';

export interface AboutValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const aboutValuesColumns: ColumnDef<AboutValue>[] = [
  {
    accessorKey: 'sortOrder',
    header: ({ column }) => <SortableHeader column={column} label="Redosled" />,
    cell: ({ row }) => <TableCellText value={row.getValue('sortOrder')} />,
  },
  {
    accessorKey: 'icon',
    header: 'Ikona',
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue('icon')}</span>
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
          {isActive ? 'Aktivna' : 'Neaktivna'}
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
      const value = row.original;
      const meta = table.options.meta as {
        onEdit?: (value: AboutValue) => void;
        onDelete?: (id: string) => void;
        onToggleActive?: (id: string, isActive: boolean) => void;
      };
      return (
        <AboutValuesTableRowActions
          value={value}
          onEdit={meta?.onEdit}
          onDelete={meta?.onDelete}
          onToggleActive={meta?.onToggleActive}
        />
      );
    },
  },
];
