'use client';

import { useMemo } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { StatsCards } from '@/module/admin/components/stats-cards/stats-cards';
import { useTRPC } from '@/trpc/client';

export function AdminView() {
  const trpc = useTRPC();

  const { data: users } = useSuspenseQuery(trpc.hello.queryOptions());

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalUsers: users.length,
      adminCount: users.filter((u) => u.role === 'admin').length,
      activeUsers: users.filter((u) => !u.banned).length,
      newThisMonth: users.filter((u) => new Date(u.createdAt) >= startOfMonth)
        .length,
    };
  }, [users]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kontrolna tabla</h1>
        <p className="text-muted-foreground mt-1">
          Dobrodošli u admin panel. Ovde možete upravljati korisnicima i
          sadržajem.
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        totalUsers={stats.totalUsers}
        adminCount={stats.adminCount}
        activeUsers={stats.activeUsers}
        newThisMonth={stats.newThisMonth}
      />

      {/* Placeholder for future content */}
      <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center">
        <p>Ovde možeš dodati dodatni sadržaj za kontrolnu tablu.</p>
      </div>
    </div>
  );
}
