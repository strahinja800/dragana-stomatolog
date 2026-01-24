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
  columns,
  type Milestone,
  type MilestonesTableMeta,
} from './milestones-table-columns';
import { MilestonesTablePagination } from './milestones-table-pagination';
import { MilestonesTableToolbar } from './milestones-table-toolbar';

interface MilestonesTableProps {
  data: Milestone[];
  onEditMilestone: (milestone: Milestone) => void;
}

export function MilestonesTable({
  data,
  onEditMilestone,
}: MilestonesTableProps) {
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
      columnVisibility,
      globalFilter,
    },
    meta: {
      onEdit: (milestone: Milestone) => onEditMilestone(milestone),
    } satisfies MilestonesTableMeta,
  });

  return (
    <div className="space-y-4">
      <MilestonesTableToolbar
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
                  data-state={row.getIsSelected() && 'selected'}
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
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nema postignuća koji odgovaraju pretrazi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <MilestonesTablePagination table={table} />
    </div>
  );
}
