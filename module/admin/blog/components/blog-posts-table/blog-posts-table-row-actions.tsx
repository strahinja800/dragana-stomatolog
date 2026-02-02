'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { type BlogPostRow } from './blog-posts-table-columns';

interface BlogPostsTableRowActionsProps {
  post: BlogPostRow;
  onEdit?: (post: BlogPostRow) => void;
  onDelete?: (id: string) => void;
}

export function BlogPostsTableRowActions({
  post,
  onEdit,
  onDelete,
}: BlogPostsTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(post)}>
          <Pencil className="mr-2 h-4 w-4" />
          Izmeni
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete?.(post.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Obriši
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
