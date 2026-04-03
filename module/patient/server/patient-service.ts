import { TRPCError } from '@trpc/server';

import type { PrismaClient } from '@/lib/generated/prisma/client';

type TransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

interface SessionUser {
  id: string;
  email: string;
  name: string;
}

interface PatientProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE';
}

export async function resolvePatient(
  tx: TransactionClient,
  sessionUser: SessionUser,
  profile?: PatientProfile
) {
  const existingByUser = await tx.patient.findUnique({
    where: { userId: sessionUser.id },
  });

  if (existingByUser) {
    return existingByUser;
  }

  const orConditions: { email?: string; phone?: string }[] = [
    { email: sessionUser.email },
  ];

  if (profile?.phone) {
    orConditions.push({ phone: profile.phone });
  }

  const legacyPatient = await tx.patient.findFirst({
    where: { OR: orConditions },
  });

  if (legacyPatient && !legacyPatient.userId) {
    return tx.patient.update({
      where: { id: legacyPatient.id },
      data: {
        userId: sessionUser.id,
        firstName: profile?.firstName ?? legacyPatient.firstName,
        lastName: profile?.lastName ?? legacyPatient.lastName,
        email: legacyPatient.email ?? sessionUser.email,
        phone: legacyPatient.phone ?? profile?.phone ?? null,
        dateOfBirth: legacyPatient.dateOfBirth ?? profile?.dateOfBirth ?? null,
        gender: legacyPatient.gender ?? profile?.gender ?? null,
        isMain: true,
      },
    });
  }

  if (legacyPatient?.userId && legacyPatient.userId !== sessionUser.id) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Pacijent sa ovim podacima već postoji',
    });
  }

  const nameParts = sessionUser.name?.trim().split(' ') ?? [];
  const firstName = profile?.firstName ?? nameParts[0] ?? '';
  const lastName = profile?.lastName ?? nameParts.slice(1).join(' ') ?? '';

  return tx.patient.create({
    data: {
      userId: sessionUser.id,
      firstName,
      lastName,
      email: sessionUser.email,
      phone: profile?.phone ?? null,
      dateOfBirth: profile?.dateOfBirth ?? null,
      gender: profile?.gender ?? null,
      isMain: true,
    },
  });
}
