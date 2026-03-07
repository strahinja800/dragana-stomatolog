import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarPlus } from '@/constants/icons';

function SkeletonItem() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Date badge skeleton */}
        <Skeleton className="size-12 rounded-lg" />

        <div className="space-y-2">
          {/* Date text skeleton */}
          <Skeleton className="h-5 w-48" />
          {/* Reason skeleton */}
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Delete button skeleton */}
      <Skeleton className="size-9 rounded-md" />
    </div>
  );
}

export function NonWorkingDaysSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>Neradni dani i praznici</span>
          <Button disabled size="sm" className="gap-2">
            <CalendarPlus className="size-4" />
            Dodaj dan
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      </CardContent>
    </Card>
  );
}
