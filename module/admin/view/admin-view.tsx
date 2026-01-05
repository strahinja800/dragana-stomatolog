'use client';

export function AdminView() {
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
      {/* <StatsCards
        totalUsers={stats.totalUsers}
        adminCount={stats.adminCount}
        activeUsers={stats.activeUsers}
        newThisMonth={stats.newThisMonth}
      /> */}

      {/* Placeholder for future content */}
      <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center">
        <p>Ovde možeš dodati dodatni sadržaj za kontrolnu tablu.</p>
      </div>
    </div>
  );
}
