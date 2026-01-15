'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';
import { type Doc } from '@/convex/_generated/dataModel';

import { PatientsTableRowActions } from './patients-table-row-actions';

export type Patient = Doc<'patients'>;

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => <SortableHeader column={column} label="Ime" />,
    cell: ({ row }) => <TableCellText value={row.getValue('firstName')} />,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <SortableHeader column={column} label="Prezime" />,
    cell: ({ row }) => <TableCellText value={row.getValue('lastName')} />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ row }) => <TableCellText value={row.getValue('email') || '—'} />,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <SortableHeader column={column} label="Telefon" />,
    cell: ({ row }) => <TableCellText value={row.getValue('phone') || '—'} />,
  },
  {
    accessorKey: 'isMain',
    header: 'Status',
    cell: ({ row }) => {
      const isMain = row.getValue('isMain') as boolean;
      return (
        <Badge variant={isMain ? 'default' : 'secondary'}>
          {isMain ? 'Glavni' : 'Sekundarni'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      const isMain = row.getValue(id) as boolean;
      return value === 'main' ? isMain : !isMain;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const patient = row.original;
      const onDelete = (
        table.options.meta as { onDelete?: (id: string) => void }
      )?.onDelete;
      return <PatientsTableRowActions patient={patient} onDelete={onDelete} />;
    },
  },
];
