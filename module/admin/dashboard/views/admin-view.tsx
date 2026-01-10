'use client';

export function AdminView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kontrolna tabla</h1>
        <p className="mt-1 text-muted-foreground">
          Dobrodošli u admin panel. Ovde možete upravljati korisnicima i
          sadržajem.
        </p>
      </div>

      {/* Stats */}
      {/* <StatsCards
        totalUsers={stats.totalUsers}
        adminCount={stats.adminCount}
        activeUsers={stats.activeUsers}
        newThisMonth={stats.newThisMonth}
      /> */}

      {/* Placeholder for future content */}
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        <p>Ovde možeš dodati dodatni sadržaj za kontrolnu tablu.</p>
      </div>
    </div>
  );
}
