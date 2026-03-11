import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle, Mail, Phone, User } from '@/constants/icons';
import { cn } from '@/lib/utils';

export function BookingSectionSkeleton() {
  return (
    <div className="section-shell relative overflow-hidden border-border/40 p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.08]" />

      <div className="relative z-10">
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Brzo zakazivanje
          </h3>
          <p className="text-sm text-muted-foreground md:text-base">
            Popunite formu i dobijte potvrdu na email
          </p>
        </div>

        <div className="space-y-5">
          {[User, Mail, Phone].map((Icon, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3.5 opacity-60">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </div>
                <Icon className="size-5 text-muted-foreground" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          ))}

          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                4
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Izaberite datum i vreme
              </span>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4 opacity-60">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
              </div>

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

          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                5
              </span>
              <span className="text-sm font-medium text-foreground/80">
                Opišite simptome (opciono)
              </span>
            </div>

            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled
              className={cn(
                'group relative h-14 w-full overflow-hidden rounded-2xl',
                'gradient-primary text-base font-semibold text-white',
                'shadow-soft',
                'disabled:cursor-not-allowed disabled:opacity-60'
              )}
            >
              <span className="relative flex items-center justify-center gap-2">
                <span>Zakažite sada</span>
                <ArrowRight className="size-5" />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-border/30 pt-5">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                Email potvrda prijema
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-4 text-primary" />
              </div>
              <span className="text-muted-foreground">
                Podsetnik 24h pre termina
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
