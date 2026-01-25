import { ArrowRight, CheckCircle, Phone, User } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function BookingSectionSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-border/30 bg-card/95 p-4 shadow-hover backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.04]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Brzo zakazivanje
          </h3>
          <p className="text-sm text-muted-foreground md:text-base">
            Popunite formu i javićemo vam se u roku od 30 minuta
          </p>
        </div>

        <div className="space-y-5">
          {/* Name field skeleton */}
          <div className="relative">
            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3.5 opacity-60">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </div>
              <User className="size-5 text-muted-foreground" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Phone field skeleton */}
          <div className="relative">
            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3.5 opacity-60">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </div>
              <Phone className="size-5 text-muted-foreground" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Calendar skeleton */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Izaberite datum i vreme
              </span>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4 opacity-60">
              {/* Calendar header */}
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={`day-${i}`} className="mx-auto h-4 w-6" />
                ))}
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton
                    key={`cell-${i}`}
                    className="mx-auto size-8 rounded-full"
                  />
                ))}
              </div>

              {/* Time slots */}
              <div className="mt-4 border-t border-border/30 pt-4">
                <Skeleton className="mb-2 h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={`time-${i}`}
                      className="h-8 w-16 rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms skeleton */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                4
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Opišite simptome (opciono)
              </span>
            </div>

            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          {/* Submit button skeleton */}
          <div className="pt-2">
            <button
              type="button"
              disabled
              className={cn(
                'group relative h-14 w-full rounded-2xl',
                'gradient-primary text-base font-semibold text-white',
                'shadow-soft',
                'disabled:cursor-not-allowed disabled:opacity-60',
                'overflow-hidden'
              )}
            >
              <span className="relative flex items-center justify-center gap-2">
                <span>Zakažite sada</span>
                <ArrowRight className="size-5" />
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-border/30 pt-5">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                Besplatna konsultacija
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Bez čekanja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
