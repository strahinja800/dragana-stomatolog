'use client';

import { useTranslations } from 'next-intl';

import { type ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';
import type { PatientData } from '@/module/admin/patients/types/patient-types';

import { PatientsTableRowActions } from './patients-table-row-actions';

export type Patient = PatientData;

export function usePatientsColumns(): ColumnDef<Patient>[] {
  const t = useTranslations('admin.patients');

  return [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <SortableHeader column={column} label={t('columnFirstName')} />
      ),
      cell: ({ row }) => <TableCellText value={row.getValue('firstName')} />,
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <SortableHeader column={column} label={t('columnLastName')} />
      ),
      cell: ({ row }) => <TableCellText value={row.getValue('lastName')} />,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <SortableHeader column={column} label={t('columnEmail')} />
      ),
      cell: ({ row }) => <TableCellText value={row.getValue('email') || '—'} />,
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <SortableHeader column={column} label={t('columnPhone')} />
      ),
      cell: ({ row }) => <TableCellText value={row.getValue('phone') || '—'} />,
    },
    {
      accessorKey: 'isMain',
      header: t('columnStatus'),
      cell: ({ row }) => {
        const isMain = row.getValue('isMain') as boolean;
        return (
          <Badge variant={isMain ? 'default' : 'secondary'}>
            {isMain ? t('statusMain') : t('statusSecondary')}
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
        return (
          <PatientsTableRowActions patient={patient} onDelete={onDelete} />
        );
      },
    },
  ];
}
