'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { UsersTable } from '@/module/admin/components/users-table/users-table';
import { useTRPC } from '@/trpc/client';

export function UsersView() {
  const trpc = useTRPC();

  const { data: users } = useSuspenseQuery(trpc.hello.queryOptions());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Korisnici</h1>
        <p className="text-muted-foreground mt-1">
          Pregled i upravljanje svim registrovanim korisnicima.
        </p>
      </div>

      {/* Users Table */}
      <UsersTable users={users} />
    </div>
  );
}
