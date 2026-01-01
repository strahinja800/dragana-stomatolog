import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from './auth';

export const requireAuth = async (currentPath: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/login?redirect=${currentPath}`);
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/');
  }

  return session;
};
