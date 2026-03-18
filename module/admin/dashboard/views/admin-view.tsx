'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { DashboardBlogStatus } from '@/module/admin/dashboard/components/dashboard-blog-status';
import { DashboardPendingAppointments } from '@/module/admin/dashboard/components/dashboard-pending-appointments';
import { DashboardQuickActions } from '@/module/admin/dashboard/components/dashboard-quick-actions';
import { DashboardRecentPatients } from '@/module/admin/dashboard/components/dashboard-recent-patients';
import { DashboardTodaysSchedule } from '@/module/admin/dashboard/components/dashboard-todays-schedule';
import { StatsCards } from '@/module/admin/dashboard/components/stats-cards';
import { useTRPC } from '@/trpc/client';

export function AdminView() {
  const trpc = useTRPC();
  const { data: todayAppointments } = useSuspenseQuery(
    trpc.appointment.getToday.queryOptions()
  );
  const { data: pendingAppointments } = useSuspenseQuery(
    trpc.appointment.getPending.queryOptions()
  );
  const { data: patientStats } = useSuspenseQuery(
    trpc.patient.getStats.queryOptions()
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kontrolna tabla</h1>
          <p className="mt-1 text-muted-foreground">
            Pregled ordinacije i brze akcije
          </p>
        </div>
        <DashboardQuickActions />
      </div>

      {/* Row 1 - Stat cards */}
      <StatsCards
        todayAppointments={todayAppointments?.length ?? 0}
        pendingAppointments={pendingAppointments?.length ?? 0}
        totalPatients={patientStats?.totalPatients ?? 0}
        newPatientsThisMonth={patientStats?.newPatientsThisMonth ?? 0}
      />

      {/* Row 2 - Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardTodaysSchedule />
        <DashboardPendingAppointments />
      </div>

      {/* Row 3 - Secondary widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardRecentPatients />
        <DashboardBlogStatus />
      </div>
    </div>
  );
}
