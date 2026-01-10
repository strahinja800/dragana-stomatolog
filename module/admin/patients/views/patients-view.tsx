'use client';

export function PatientsView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pacijenti</h1>
        <p className="mt-1 text-muted-foreground">
          Pregled i upravljanje svim registrovanim pacijentima.
        </p>
      </div>

      {/* Users Table - TODO: Implement with Convex useQuery(api.users.listUsers) */}
    </div>
  );
}
