'use client';

import { Suspense, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarClock, Loader2 } from '@/constants/icons';
import { AppointmentTable } from '@/module/admin/termini/components/appointment-table/appointment-table';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
type StatusFilter = 'ALL' | AppointmentStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Svi termini' },
  { value: 'PENDING', label: 'Na čekanju' },
  { value: 'CONFIRMED', label: 'Potvrđeni' },
  { value: 'CANCELLED', label: 'Odbijeni' },
];

function TableSkeleton() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function AppointmentsView() {
  const [activeTab, setActiveTab] = useState<StatusFilter>('ALL');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <CalendarClock className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Termini</h1>
          <p className="text-sm text-muted-foreground">
            Upravljajte zahtevima za termine i zakazivanjima
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as StatusFilter)}
        >
          <CardHeader className="border-b bg-muted/30 px-6 py-4">
            <CardTitle className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg font-semibold">Pregled termina</span>
              <TabsList className="grid w-full grid-cols-4 sm:w-auto">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-xs sm:text-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* ALL tab */}
            <TabsContent value="ALL" className="m-0">
              <Suspense fallback={<TableSkeleton />}>
                <AppointmentTable />
              </Suspense>
            </TabsContent>

            {/* Other tabs - filtered */}
            {STATUS_TABS.filter(
              (tab): tab is { value: AppointmentStatus; label: string } =>
                tab.value !== 'ALL'
            ).map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="m-0">
                <Suspense fallback={<TableSkeleton />}>
                  <AppointmentTable statusFilter={tab.value} />
                </Suspense>
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
