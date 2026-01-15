'use client';

import { type Preloaded } from 'convex/react';
import { Calendar, Clock, Stethoscope } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type api } from '@/convex/_generated/api';
import { NonWorkingDaysTab } from '@/module/admin/podesavanja/components/non-working-days-tab';
import { ServiceTypesTab } from '@/module/admin/podesavanja/components/service-types-tab';
import { WorkingHoursTab } from '@/module/admin/podesavanja/components/working-hours-tab';

interface SettingsViewProps {
  preloadedWorkingHours: Preloaded<typeof api.settings.getWorkingHours>;
  preloadedNonWorkingDays: Preloaded<typeof api.settings.getNonWorkingDays>;
  preloadedServiceTypes: Preloaded<typeof api.settings.getServiceTypes>;
}

export function SettingsView({
  preloadedWorkingHours,
  preloadedNonWorkingDays,
  preloadedServiceTypes,
}: SettingsViewProps) {
  return (
    <div className="space-y-8">
      {/* Header with gradient accent */}
      <div className="relative">
        <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-primary via-primary/50 to-transparent" />
        <div className="pl-4">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Podešavanja
          </h1>
          <p className="mt-1 text-muted-foreground">
            Upravljajte radnim vremenom, neradnim danima i tipovima usluga
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="working-hours" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-3 gap-1 bg-muted/50 p-1">
          <TabsTrigger
            value="working-hours"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Clock className="size-4" />
            <span className="hidden sm:inline">Radno vreme</span>
            <span className="sm:hidden">Vreme</span>
          </TabsTrigger>
          <TabsTrigger
            value="non-working-days"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Neradni dani</span>
            <span className="sm:hidden">Dani</span>
          </TabsTrigger>
          <TabsTrigger
            value="service-types"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Stethoscope className="size-4" />
            <span className="hidden sm:inline">Tipovi usluga</span>
            <span className="sm:hidden">Usluge</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="working-hours" className="mt-6">
          <WorkingHoursTab preloadedData={preloadedWorkingHours} />
        </TabsContent>

        <TabsContent value="non-working-days" className="mt-6">
          <NonWorkingDaysTab preloadedData={preloadedNonWorkingDays} />
        </TabsContent>

        <TabsContent value="service-types" className="mt-6">
          <ServiceTypesTab preloadedData={preloadedServiceTypes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
