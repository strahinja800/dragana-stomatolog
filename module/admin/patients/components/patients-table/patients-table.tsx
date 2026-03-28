/* eslint-disable react-hooks/incompatible-library */

'use client';

import { useState } from 'react';

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/shared/table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { columns, type Patient } from './patients-table-columns';
import { PatientsTableToolbar } from './patients-table-toolbar';

interface PatientsTableProps {
  data: Patient[];
  onDeletePatient: (patientId: string) => void;
}

export function PatientsTable({ data, onDeletePatient }: PatientsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const firstName =
        (row.getValue('firstName') as string)?.toLowerCase() ?? '';
      const lastName =
        (row.getValue('lastName') as string)?.toLowerCase() ?? '';
      const email = (row.getValue('email') as string)?.toLowerCase() ?? '';
      const phone = (row.getValue('phone') as string)?.toLowerCase() ?? '';

      return (
        firstName.includes(searchValue) ||
        lastName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    meta: {
      onDelete: (id: string) => onDeletePatient(id),
    },
  });

  return (
    <div className="space-y-4">
      <PatientsTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.id === 'actions' &&
                        'w-12 sticky right-0 z-10 bg-white dark:bg-background'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.id === 'actions' &&
                          'sticky right-0 bg-white dark:bg-background group-hover:bg-muted'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nema pacijenata koji odgovaraju pretrazi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalLabel="Ukupno pacijenata:" />
    </div>
  );
}
