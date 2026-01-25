'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
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
import { CalendarClock, Loader2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/module/admin/termini/components/confirm-dialog';
import { RejectDialog } from '@/module/admin/termini/components/reject-dialog';
import { RescheduleDialog } from '@/module/admin/termini/components/reschedule-dialog';
import { useTRPC } from '@/trpc/client';

import {
  type Appointment,
  type AppointmentStatus,
  type AppointmentTableMeta,
  columns,
} from './appointment-table-columns';
import { AppointmentTablePagination } from './appointment-table-pagination';
import { AppointmentTableToolbar } from './appointment-table-toolbar';

interface AppointmentTableProps {
  statusFilter?: AppointmentStatus;
}

export function AppointmentTable({ statusFilter }: AppointmentTableProps) {
  const [confirmAppointment, setConfirmAppointment] =
    useState<Appointment | null>(null);
  const [rejectAppointment, setRejectAppointment] =
    useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<Appointment | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.appointment.getAll.queryOptions({ status: statusFilter })
  );

  const appointments = (data?.appointments ?? []) as Appointment[];

  const table = useReactTable({
    data: appointments,
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
      const patient = (row.getValue('patient') as string)?.toLowerCase() ?? '';
      const phone = (row.getValue('phone') as string)?.toLowerCase() ?? '';
      const symptoms =
        (row.getValue('symptoms') as string)?.toLowerCase() ?? '';

      return (
        patient.includes(searchValue) ||
        phone.includes(searchValue) ||
        symptoms.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    meta: {
      onConfirm: setConfirmAppointment,
      onReject: setRejectAppointment,
      onReschedule: setRescheduleAppointment,
    } satisfies AppointmentTableMeta,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
          <CalendarClock className="size-7 text-muted-foreground" />
        </div>
        <p className="font-medium text-muted-foreground">Nema termina</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
          {statusFilter === 'PENDING'
            ? 'Trenutno nema zahteva na čekanju'
            : statusFilter === 'CONFIRMED'
              ? 'Nema potvrđenih termina'
              : statusFilter === 'CANCELLED'
                ? 'Nema odbijenih termina'
                : 'Nema zakazanih termina'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 p-4">
        <AppointmentTableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.id === 'symptoms' &&
                          'hidden w-[200px] lg:table-cell',
                        header.column.id === 'patient' && 'w-[180px]',
                        header.column.id === 'phone' && 'w-[130px]',
                        header.column.id === 'dateTime' && 'w-[180px]',
                        header.column.id === 'status' && 'w-[120px]',
                        header.column.id === 'actions' && 'w-[80px] text-right'
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
                    className={cn(
                      'group transition-colors',
                      row.original.status === 'PENDING' &&
                        'bg-amber-50/50 dark:bg-amber-950/10'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.id === 'symptoms' &&
                            'hidden lg:table-cell',
                          cell.column.id === 'actions' && 'text-right'
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
                    Nema termina koji odgovaraju pretrazi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <AppointmentTablePagination table={table} />
      </div>

      <ConfirmDialog
        appointment={confirmAppointment}
        onClose={() => setConfirmAppointment(null)}
      />
      <RejectDialog
        appointment={rejectAppointment}
        onClose={() => setRejectAppointment(null)}
      />
      <RescheduleDialog
        appointment={rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
      />
    </>
  );
}
