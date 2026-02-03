'use client';

import Image from 'next/image';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { ImageIcon } from 'lucide-react';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  imageAlt: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export const columns: ColumnDef<BlogPostRow>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <SortableHeader column={column} label="Naslov" className="ml-1" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.featuredImage ? (
          <Image
            src={row.original.featuredImage}
            alt={row.original.imageAlt ?? stripHtml(row.getValue('title'))}
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-cover shrink-0"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted shrink-0">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <span className="font-medium truncate">
          {stripHtml(row.getValue('title'))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'PUBLISHED' ? 'default' : 'secondary'}>
          {status === 'PUBLISHED' ? 'Objavljen' : 'Draft'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'publishedAt',
    header: ({ column }) => (
      <SortableHeader column={column} label="Datum objave" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('publishedAt') as Date | null;
      return (
        <TableCellText
          value={date ? format(date, 'd. MMM yyyy.', { locale: sr }) : '—'}
        />
      );
    },
  },
];
