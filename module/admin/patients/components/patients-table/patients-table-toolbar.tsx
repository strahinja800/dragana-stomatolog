'use client';

import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from '@/constants/icons';

import { type Patient } from './patients-table-columns';

interface PatientsTableToolbarProps {
  table: Table<Patient>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

const columnLabels: Record<string, string> = {
  firstName: 'Ime',
  lastName: 'Prezime',
  email: 'Email',
  phone: 'Telefon',
  isMain: 'Status',
};

export function PatientsTableToolbar({
  table,
  globalFilter,
  setGlobalFilter,
}: PatientsTableToolbarProps) {
  const isFiltered =
    globalFilter.length > 0 ||
    table.getColumn('isMain')?.getFilterValue() !== undefined;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži pacijente..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="bg-white pl-8"
          />
        </div>
        <Select
          value={
            (table.getColumn('isMain')?.getFilterValue() as string) ?? 'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('isMain')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className="w-[130px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Svi</SelectItem>
            <SelectItem value="main">Glavni</SelectItem>
            <SelectItem value="secondary">Sekundarni</SelectItem>
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setGlobalFilter('');
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Poništi
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto bg-white">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Kolone
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Prikaži kolone</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnLabels[column.id] || column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
