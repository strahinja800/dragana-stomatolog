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

import {
  teamMembersColumns,
  type TeamMember,
} from './team-members-table-columns';

interface TeamMembersTableProps {
  data: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function TeamMembersTable({
  data,
  onEdit,
  onDelete,
  onToggleActive,
}: TeamMembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'sortOrder', desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns: teamMembersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const name = (row.getValue('name') as string)?.toLowerCase() ?? '';
      const role = (row.getValue('role') as string)?.toLowerCase() ?? '';
      const specialty =
        (row.getValue('specialty') as string)?.toLowerCase() ?? '';

      return (
        name.includes(searchValue) ||
        role.includes(searchValue) ||
        specialty.includes(searchValue)
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
        searchPlaceholder="Pretraži članove tima..."
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={teamMembersColumns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Nema članova tima. Kliknite "Dodaj člana tima" da dodate prvog.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      <DataTablePagination table={table} totalLabel="Ukupno članova:" />
    </div>
  );
}

export { type TeamMember } from './team-members-table-columns';
