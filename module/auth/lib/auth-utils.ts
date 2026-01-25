import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth-server';
import { USER_ROLES } from '@/module/auth/types/auth-types';

export const requireAuth = async (currentPath: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/login?redirect=${currentPath}`);
  }

  return session.user;
};

export const requireAdmin = async (currentPath: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== USER_ROLES.ADMIN) {
    redirect(`/login?redirect=${currentPath}`);
  }

  return session.user;
};

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/');
  }

  return null;
};
