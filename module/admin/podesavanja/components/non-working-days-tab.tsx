'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { format } from 'date-fns';
import { enUS, sr } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarPlus, Loader2, Trash2 } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

export function NonWorkingDaysTab() {
  const t = useTranslations('admin.settings');
  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: nonWorkingDays } = useSuspenseQuery(
    trpc.settings.getNonWorkingDays.queryOptions({
      year: new Date().getFullYear(),
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutate: createNonWorkingDay, isPending: isCreating } = useMutation(
    trpc.settings.createNonWorkingDay.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['settings']] });
        toast.success(t('addSuccess'));
        setIsDialogOpen(false);
        setSelectedDate(undefined);
        setReason('');
      },
      onError: (error) => {
        toast.error(t('addError'), {
          description: error instanceof Error ? error.message : t('addError'),
        });
      },
    })
  );

  const { mutate: deleteNonWorkingDay, isPending: isDeleting } = useMutation(
    trpc.settings.deleteNonWorkingDay.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [['settings']] });
        toast.success(t('deleteSuccess'));
        setDeletingId(null);
      },
      onError: (error) => {
        toast.error(t('addError'), {
          description: error instanceof Error ? error.message : t('addError'),
        });
        setDeletingId(null);
      },
    })
  );

  const handleCreate = () => {
    if (!selectedDate) return;
    createNonWorkingDay({
      date: selectedDate,
      reason: reason || undefined,
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteNonWorkingDay({ id });
  };

  // Get existing dates for calendar highlighting
  const existingDates = nonWorkingDays.map((d) => new Date(d.date));

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>{t('nonWorkingDaysTitle')}</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <CalendarPlus className="size-4" />
                {t('addDay')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('addDayTitle')}</DialogTitle>
                <DialogDescription>{t('addDayDescription')}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={existingDates}
                    modifiers={{ existing: existingDates }}
                    modifiersClassNames={{
                      existing:
                        'bg-destructive/20 text-destructive line-through',
                    }}
                    className="rounded-lg border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">{t('reasonOptional')}</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t('reasonPlaceholder')}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!selectedDate || isCreating}
                  className="gap-2"
                >
                  {isCreating && <Loader2 className="size-4 animate-spin" />}
                  {t('save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {nonWorkingDays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarPlus className="size-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t('noDays')}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {t('noDaysHint')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {nonWorkingDays.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  {/* Date badge */}
                  <div className="flex size-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-lg font-bold leading-none">
                      {format(new Date(day.date), 'd')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">
                      {format(new Date(day.date), 'MMM', {
                        locale: dateLocale,
                      })}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium">
                      {format(new Date(day.date), 'EEEE, d. MMMM yyyy.', {
                        locale: dateLocale,
                      })}
                    </p>
                    {day.reason && (
                      <p className="text-sm text-muted-foreground">
                        {day.reason}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(day.id)}
                  disabled={deletingId === day.id}
                  className={cn(
                    'text-muted-foreground hover:text-destructive',
                    'hover:bg-destructive/10'
                  )}
                >
                  {deletingId === day.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
