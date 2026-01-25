import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { DAY_NAMES, DAY_NAMES_SHORT } from './working-hours-constants';

function SkeletonRow({ dayIndex }: { dayIndex: number }) {
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4',
        'md:grid-cols-[140px_1fr_auto_auto_auto]'
      )}
    >
      {/* Day name */}
      <div className="font-medium text-muted-foreground">
        <span className="hidden md:inline">{DAY_NAMES[dayIndex]}</span>
        <span className="md:hidden">{DAY_NAMES_SHORT[dayIndex]}</span>
      </div>

      {/* Status badge skeleton - hidden on mobile */}
      <div className="hidden md:block">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Time inputs skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-[100px]" />
        <span className="text-muted-foreground">-</span>
        <Skeleton className="h-9 w-[100px]" />
      </div>

      {/* Toggle - disabled */}
      <Switch disabled checked={false} />
    </div>
  );
}

export function WorkingHoursSkeleton() {
  // Order: Monday (1) to Saturday (6), then Sunday (0)
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>Radno vreme po danima</span>
          <Button disabled size="sm" className="gap-2">
            Sačuvaj
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {dayOrder.map((dayIndex) => (
            <SkeletonRow key={dayIndex} dayIndex={dayIndex} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
