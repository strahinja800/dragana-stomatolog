'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const AdminView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.hello.queryOptions());

  return (
    <div>
      <h1>Admin View</h1>
      <p>Users: {data.length}</p>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
