'use client';

import { useTranslations } from 'next-intl';

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

import { type BlogPostRow } from './blog-posts-table-columns';

interface BlogPostsTableToolbarProps {
  table: Table<BlogPostRow>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function BlogPostsTableToolbar({
  table,
  globalFilter,
  setGlobalFilter,
}: BlogPostsTableToolbarProps) {
  const t = useTranslations('admin.blog');
  const isFiltered =
    globalFilter.length > 0 ||
    table.getColumn('status')?.getFilterValue() !== undefined;

  const columnLabels: Record<string, string> = {
    title: t('columnTitle'),
    status: t('columnStatus'),
    publishedAt: t('columnPublishedAt'),
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="bg-white pl-8"
          />
        </div>
        <Select
          value={
            (table.getColumn('status')?.getFilterValue() as string) ?? 'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('status')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder={t('statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('statusAll')}</SelectItem>
            <SelectItem value="DRAFT">{t('statusDraft')}</SelectItem>
            <SelectItem value="PUBLISHED">{t('statusPublished')}</SelectItem>
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
            {t('resetButton')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto bg-white">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {t('columnsButton')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>{t('showColumns')}</DropdownMenuLabel>
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
