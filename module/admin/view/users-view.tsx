'use client';

export function UsersView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Korisnici</h1>
        <p className="text-muted-foreground mt-1">
          Pregled i upravljanje svim registrovanim korisnicima.
        </p>
      </div>

      {/* Users Table - TODO: Implement with Convex useQuery(api.users.listUsers) */}
    </div>
  );
}
