import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function SkeletonTableRow() {
  return (
    <TableRow>
      {/* Name */}
      <TableCell>
        <Skeleton className="h-5 w-32" />
      </TableCell>
      {/* Duration */}
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      {/* Description - hidden on mobile */}
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-48" />
      </TableCell>
      {/* Status */}
      <TableCell className="text-center">
        <Skeleton className="mx-auto h-5 w-16 rounded-full" />
      </TableCell>
      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ServiceTypesSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>Tipovi usluga</span>
          <Button disabled size="sm" className="gap-2">
            <Plus className="size-4" />
            Dodaj uslugu
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Naziv</TableHead>
              <TableHead className="w-[100px]">Trajanje</TableHead>
              <TableHead className="hidden md:table-cell">Opis</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[100px] text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
