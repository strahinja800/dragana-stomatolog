'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Check, Loader2 } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import type { RouterOutputs } from '@/trpc/root-router';

import { DAY_NAMES, DAY_NAMES_SHORT } from './working-hours-constants';

type WorkingHour = RouterOutputs['settings']['getWorkingHours'][number];

interface WorkingHoursFormData {
  hours: WorkingHour[];
}

export function WorkingHoursTab() {
  const t = useTranslations('admin.settings');
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: workingHours } = useSuspenseQuery(
    trpc.settings.getWorkingHours.queryOptions()
  );

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<WorkingHoursFormData>({
    values: { hours: workingHours },
  });

  const { fields } = useFieldArray({
    control,
    name: 'hours',
  });

  const { mutate: upsertWorkingHours, isPending } = useMutation(
    trpc.settings.upsertWorkingHours.mutationOptions({
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: [['settings']] });
        toast.success(t('saveSuccess'));
      },
      onError: (error) => {
        toast.error(t('saveError'), {
          description: error instanceof Error ? error.message : t('saveError'),
        });
      },
    })
  );

  const onSubmit = (data: WorkingHoursFormData) => {
    upsertWorkingHours({ hours: data.hours });
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>{t('workingHoursPerDay')}</span>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !isDirty}
            size="sm"
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <Check className="size-4" />
                {t('save')}
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`hours.${index}`}
              render={({ field: { value, onChange } }) => (
                <Field
                  orientation="horizontal"
                  className={cn(
                    'grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4 transition-colors',
                    'md:grid-cols-[140px_1fr_auto_auto_auto]',
                    !value.isOpen && 'bg-muted/20'
                  )}
                >
                  {/* Day name */}
                  <div className="font-medium">
                    <span className="hidden md:inline">
                      {DAY_NAMES[value.dayOfWeek]}
                    </span>
                    <span className="md:hidden">
                      {DAY_NAMES_SHORT[value.dayOfWeek]}
                    </span>
                  </div>

                  {/* Status badge - hidden on mobile */}
                  <div className="hidden md:block">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        value.isOpen
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {value.isOpen ? t('open') : t('closed')}
                    </span>
                  </div>

                  {/* Time inputs */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={value.startTime}
                      onChange={(e) =>
                        onChange({ ...value, startTime: e.target.value })
                      }
                      disabled={!value.isOpen}
                      className="w-[100px] text-center disabled:opacity-50"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={value.endTime}
                      onChange={(e) =>
                        onChange({ ...value, endTime: e.target.value })
                      }
                      disabled={!value.isOpen}
                      className="w-[100px] text-center disabled:opacity-50"
                    />
                  </div>

                  {/* Toggle */}
                  <Switch
                    checked={value.isOpen}
                    onCheckedChange={(checked) =>
                      onChange({ ...value, isOpen: checked })
                    }
                    aria-label={`Toggle ${DAY_NAMES[value.dayOfWeek]}`}
                  />
                </Field>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
