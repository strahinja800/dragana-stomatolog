'use client';

import { type Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SortableHeaderProps<T> {
  column: Column<T>;
  label: string;
}

export function SortableHeader<T>({ column, label }: SortableHeaderProps<T>) {
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

  const directionText =
    sorted === 'asc'
      ? ', rastući redosled'
      : sorted === 'desc'
        ? ', opadajući redosled'
        : '';

  return (
    <button
      onClick={handleSort}
      aria-label={`Sortiraj po koloni ${label}${directionText}`}
      className="flex items-center ml-5"
    >
      <span>{label}</span>
      {sorted === 'asc' && (
        <ArrowUp className="ml-2 h-4 w-4 text-primary stroke-[2.5]" />
      )}
      {sorted === 'desc' && (
        <ArrowDown className="ml-2 h-4 w-4 text-primary stroke-[2.5]" />
      )}
      {!sorted && <ArrowDown className="ml-2 h-4 w-4 text-muted-foreground" />}
    </button>
  );
}
