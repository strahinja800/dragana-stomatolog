'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { TableCellText } from '@/components/shared/table/table-cell-text';
import { Badge } from '@/components/ui/badge';

import { BlogPostsTableRowActions } from './blog-posts-table-row-actions';

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
    header: ({ column }) => <SortableHeader column={column} label="Naslov" />,
    cell: ({ row }) => (
      <TableCellText value={stripHtml(row.getValue('title'))} />
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
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const post = row.original;
      const meta = table.options.meta as {
        onEdit?: (post: BlogPostRow) => void;
        onDelete?: (id: string) => void;
      };
      return (
        <BlogPostsTableRowActions
          post={post}
          onEdit={meta?.onEdit}
          onDelete={meta?.onDelete}
        />
      );
    },
  },
];
