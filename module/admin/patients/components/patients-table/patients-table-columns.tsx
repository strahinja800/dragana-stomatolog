'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Doc } from '@/convex/_generated/dataModel';

import { PatientsTableRowActions } from './patients-table-row-actions';

export type Patient = Doc<'patients'>;

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Ime
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('firstName')}</span>
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Prezime
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue('email') || '—',
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Telefon
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue('phone') || '—',
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
