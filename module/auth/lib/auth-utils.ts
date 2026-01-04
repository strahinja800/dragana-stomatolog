import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { USER_ROLES } from '@/module/auth/types/auth-types';

import { auth } from './auth';

export const requireAuth = async (currentPath: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/login?redirect=${currentPath}`);
  }

  return session;
};

export const requireAdmin = async (currentPath: string) => {
  const session = await requireAuth(currentPath);
  console.log('session', session);

  if (session.user.role !== USER_ROLES.ADMIN) {
    redirect('/');
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
