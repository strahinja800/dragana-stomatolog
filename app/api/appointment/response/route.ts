import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const action = searchParams.get('action'); // 'accept' ili 'reject'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const redirectUrl = (status: string) =>
    NextResponse.redirect(`${baseUrl}/termin/odgovor?status=${status}`);

  if (!token || (action !== 'accept' && action !== 'reject')) {
    return redirectUrl('invalid');
  }

  const verification = await prisma.verification.findFirst({
    where: { value: token },
  });

  if (!verification) {
    return redirectUrl('invalid');
  }

  if (verification.expiresAt < new Date()) {
    await prisma.verification.delete({ where: { id: verification.id } });
    return redirectUrl('expired');
  }

  const appointmentId = verification.identifier.split(':')[1];
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment?.proposedStartTime || !appointment?.proposedEndTime) {
    return redirectUrl('invalid');
  }

  if (action === 'accept') {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        startTime: appointment.proposedStartTime,
        endTime: appointment.proposedEndTime,
        proposedStartTime: null,
        proposedEndTime: null,
        status: 'CONFIRMED',
      },
    });
  } else {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        proposedStartTime: null,
        proposedEndTime: null,
        status: 'CANCELLED',
      },
    });
  }

  await prisma.verification.delete({ where: { id: verification.id } });
  return redirectUrl(action === 'accept' ? 'accepted' : 'rejected');
}
