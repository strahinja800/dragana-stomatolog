import { redirect } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery, isAuthenticated } from '@/lib/auth-server';
import { USER_ROLES } from '@/module/auth/types/auth-types';

export const requireAuth = async (currentPath: string) => {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(`/login?redirect=${currentPath}`);
  }

  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  return user;
};

export const requireAdmin = async (currentPath: string) => {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(`/login?redirect=${currentPath}`);
  }

  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  if (!user || user.role !== USER_ROLES.ADMIN) {
    redirect('/');
  }

  return user;
};

export const requireUnAuth = async () => {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/');
  }

  return null;
};
