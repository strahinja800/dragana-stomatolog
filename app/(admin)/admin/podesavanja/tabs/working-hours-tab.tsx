'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

const DAY_NAMES = [
  'Nedelja',
  'Ponedeljak',
  'Utorak',
  'Sreda',
  'Četvrtak',
  'Petak',
  'Subota',
] as const;

const DAY_NAMES_SHORT = [
  'Ned',
  'Pon',
  'Uto',
  'Sre',
  'Čet',
  'Pet',
  'Sub',
] as const;

interface WorkingHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export function WorkingHoursTab() {
  const workingHours = useQuery(api.settings.getWorkingHours);
  const upsertWorkingHours = useMutation(api.settings.upsertWorkingHours);

  const [hours, setHours] = useState<WorkingHour[] | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Initialize state from server data when it loads
  const displayHours =
    hours ??
    workingHours?.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      startTime: h.startTime,
      endTime: h.endTime,
      isOpen: h.isOpen,
    })) ??
    [];

  const updateHour = (
    dayOfWeek: number,
    field: keyof WorkingHour,
    value: string | boolean
  ) => {
    const currentHours =
      hours ??
      workingHours?.map((h) => ({
        dayOfWeek: h.dayOfWeek,
        startTime: h.startTime,
        endTime: h.endTime,
        isOpen: h.isOpen,
      })) ??
      [];

    setHours(
      currentHours.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hours) return;

    setIsPending(true);
    try {
      await upsertWorkingHours({ hours });
      toast.success('Radno vreme sačuvano');
      setHasChanges(false);
      setHours(null); // Reset to use server data
    } catch (error) {
      toast.error('Greška pri čuvanju', {
        description:
          error instanceof Error ? error.message : 'Nepoznata greška',
      });
    } finally {
      setIsPending(false);
    }
  };

  if (!workingHours) {
    return (
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Reorder to start from Monday (1) instead of Sunday (0)
  const orderedHours = [...displayHours.slice(1), displayHours[0]];

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>Radno vreme po danima</span>
          <Button
            onClick={handleSave}
            disabled={isPending || !hasChanges}
            size="sm"
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Čuvanje...
              </>
            ) : (
              <>
                <Check className="size-4" />
                Sačuvaj
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {orderedHours.map((hour) => (
            <div
              key={hour.dayOfWeek}
              className={cn(
                'grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4 transition-colors',
                'md:grid-cols-[140px_1fr_auto_auto_auto]',
                !hour?.isOpen && 'bg-muted/20'
              )}
            >
              {/* Day name */}
              <div className="font-medium">
                <span className="hidden md:inline">
                  {DAY_NAMES[hour?.dayOfWeek]}
                </span>
                <span className="md:hidden">
                  {DAY_NAMES_SHORT[hour?.dayOfWeek]}
                </span>
              </div>

              {/* Status badge - hidden on mobile */}
              <div className="hidden md:block">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    hour.isOpen
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {hour?.isOpen ? 'Otvoreno' : 'Zatvoreno'}
                </span>
              </div>

              {/* Time inputs */}
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={hour.startTime}
                  onChange={(e) =>
                    updateHour(hour.dayOfWeek, 'startTime', e.target.value)
                  }
                  disabled={!hour.isOpen}
                  className="w-[100px] text-center disabled:opacity-50"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="time"
                  value={hour.endTime}
                  onChange={(e) =>
                    updateHour(hour.dayOfWeek, 'endTime', e.target.value)
                  }
                  disabled={!hour.isOpen}
                  className="w-[100px] text-center disabled:opacity-50"
                />
              </div>

              {/* Toggle */}
              <Switch
                checked={hour.isOpen}
                onCheckedChange={(checked) =>
                  updateHour(hour.dayOfWeek, 'isOpen', checked)
                }
                aria-label={`Toggle ${DAY_NAMES[hour?.dayOfWeek]}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
