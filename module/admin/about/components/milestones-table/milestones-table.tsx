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
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/shared/table/data-table-pagination';
import { DataTableToolbar } from '@/components/shared/table/data-table-toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { type Milestone, milestonesColumns } from './milestones-table-columns';

interface MilestonesTableProps {
  data: Milestone[];
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function MilestonesTable({
  data,
  onEdit,
  onDelete,
  onToggleActive,
}: MilestonesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'sortOrder', desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns: milestonesColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const year = (row.getValue('year') as string)?.toLowerCase() ?? '';
      const title = (row.getValue('title') as string)?.toLowerCase() ?? '';
      const description =
        (row.getValue('description') as string)?.toLowerCase() ?? '';

      return (
        year.includes(searchValue) ||
        title.includes(searchValue) ||
        description.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      onEdit,
      onDelete,
      onToggleActive,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder="Pretraži postignuća..."
      />
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  className={cn(!row.original.isActive && 'opacity-50')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  colSpan={milestonesColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nema postignuća. Kliknite "Dodaj postignuće" da dodate prvo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalLabel="Ukupno postignuća:" />
    </div>
  );
}

export { type Milestone } from './milestones-table-columns';
