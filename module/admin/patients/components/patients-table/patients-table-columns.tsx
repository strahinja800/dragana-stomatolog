'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Doc } from '@/convex/_generated/dataModel';

import { PatientsTableRowActions } from './patients-table-row-actions';

export type Patient = Doc<'patients'>;

function getSortAriaLabel(
  columnName: string,
  sortDirection: false | 'asc' | 'desc'
): string {
  const directionText =
    sortDirection === 'asc'
      ? ', rastući redosled'
      : sortDirection === 'desc'
        ? ', opadajući redosled'
        : '';
  return `Sortiraj po koloni ${columnName}${directionText}`;
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      const handleSort = () => {
        if (!sorted) {
          column.toggleSorting(false); // rastuce
        } else if (sorted === 'asc') {
          column.toggleSorting(true); // opadajuce
        } else {
          column.clearSorting();
        }
      };

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          aria-label={getSortAriaLabel('Ime', sorted)}
          className="-translate-x-2.1"
        >
          {!sorted && <span className="translate-x-3">Ime</span>}
          {sorted && <span>Ime</span>}

          {sorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {sorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
          {!sorted && <ArrowDown className="ml-2 h-4 w-4 opacity-0" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-medium ml-5">{row.getValue('firstName')}</span>
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      const handleSort = () => {
        if (!sorted) {
          column.toggleSorting(false);
        } else if (sorted === 'asc') {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      };

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          aria-label={getSortAriaLabel('Prezime', sorted)}
          className="-translate-x-2.1"
        >
          {!sorted && <span className="translate-x-3">Prezime</span>}
          {sorted && <span>Prezime</span>}

          {sorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {sorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
          {!sorted && <ArrowDown className="ml-2 h-4 w-4 opacity-0" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-medium ml-5">{row.getValue('lastName')}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      const handleSort = () => {
        if (!sorted) {
          column.toggleSorting(false);
        } else if (sorted === 'asc') {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      };

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          aria-label={getSortAriaLabel('Email', sorted)}
          className="-translate-x-2.1"
        >
          {!sorted && <span className="translate-x-3">Email</span>}
          {sorted && <span>Email</span>}
          {sorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {sorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
          {!sorted && <ArrowDown className="ml-2 h-4 w-4 opacity-0" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-medium ml-5">{row.getValue('email') || '—'}</span>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      const handleSort = () => {
        if (!sorted) {
          column.toggleSorting(false);
        } else if (sorted === 'asc') {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      };

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          aria-label={getSortAriaLabel('Telefon', sorted)}
          className="-translate-x-2.1"
        >
          {!sorted && <span className="translate-x-3">Telefon</span>}
          {sorted && <span>Telefon</span>}
          {sorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {sorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
          {!sorted && <ArrowDown className="ml-2 h-4 w-4 opacity-0" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-medium ml-5">{row.getValue('phone') || '—'}</span>
    ),
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
