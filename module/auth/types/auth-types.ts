export const USER_ROLES = {
  ADMIN: 'admin',
  DENTIST: 'dentist',
  PATIENT: 'patient',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
};
