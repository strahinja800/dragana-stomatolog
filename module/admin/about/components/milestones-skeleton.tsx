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
import { Plus } from '@/constants/icons';

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-32" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-48" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="mx-auto h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto size-8 rounded-md" />
      </TableCell>
    </TableRow>
  );
}

export function MilestonesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Naša postignuća</h2>
          <p className="text-sm text-muted-foreground">
            Važni događaji i postignuća koji se prikazuju na timeline-u
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 size-4" />
          Dodaj postignuće
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sva postignuća</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Godina</TableHead>
                    <TableHead>Naslov</TableHead>
                    <TableHead className="hidden md:table-cell">Opis</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
