'use client';

import { type Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from '@/constants/icons';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  searchPlaceholder = 'Pretraži...',
}: DataTableToolbarProps<TData>) {
  const isFiltered = globalFilter.length > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-white pl-8"
        />
      </div>
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
  );
}
