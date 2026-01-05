'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { CalendarPlus, Loader2, Trash2 } from 'lucide-react';
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
import { api } from '@/convex/_generated/api';
import { type Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

export function NonWorkingDaysTab() {
  const nonWorkingDays = useQuery(api.settings.getNonWorkingDays, {});
  const createNonWorkingDay = useMutation(api.settings.createNonWorkingDay);
  const deleteNonWorkingDay = useMutation(api.settings.deleteNonWorkingDay);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!selectedDate) return;

    setIsCreating(true);
    try {
      await createNonWorkingDay({
        date: selectedDate.getTime(),
        reason: reason || undefined,
      });
      toast.success('Neradni dan dodat');
      setIsDialogOpen(false);
      setSelectedDate(undefined);
      setReason('');
    } catch (error) {
      toast.error('Greška', {
        description:
          error instanceof Error ? error.message : 'Nepoznata greška',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: Id<'nonWorkingDays'>) => {
    setDeletingId(id);
    try {
      await deleteNonWorkingDay({ id });
      toast.success('Neradni dan obrisan');
    } catch (error) {
      toast.error('Greška', {
        description:
          error instanceof Error ? error.message : 'Nepoznata greška',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!nonWorkingDays) {
    return (
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Get existing dates for calendar highlighting
  const existingDates = nonWorkingDays.map((d) => new Date(d.date));

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>Neradni dani i praznici</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <CalendarPlus className="size-4" />
                Dodaj dan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Dodaj neradni dan</DialogTitle>
                <DialogDescription>
                  Izaberite datum i opciono unesite razlog
                </DialogDescription>
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
                  <Label htmlFor="reason">Razlog (opciono)</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="npr. Državni praznik, Godišnji odmor..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Otkaži
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!selectedDate || isCreating}
                  className="gap-2"
                >
                  {isCreating && <Loader2 className="size-4 animate-spin" />}
                  Sačuvaj
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
            <p className="text-muted-foreground">
              Nema definisanih neradnih dana
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Kliknite &quot;Dodaj dan&quot; za dodavanje praznika ili drugih
              neradnih dana
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {nonWorkingDays.map((day) => (
              <div
                key={day._id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  {/* Date badge */}
                  <div className="flex size-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-lg font-bold leading-none">
                      {format(new Date(day.date), 'd')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">
                      {format(new Date(day.date), 'MMM', { locale: sr })}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium">
                      {format(new Date(day.date), 'EEEE, d. MMMM yyyy.', {
                        locale: sr,
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
                  onClick={() => handleDelete(day._id)}
                  disabled={deletingId === day._id}
                  className={cn(
                    'text-muted-foreground hover:text-destructive',
                    'hover:bg-destructive/10'
                  )}
                >
                  {deletingId === day._id ? (
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
