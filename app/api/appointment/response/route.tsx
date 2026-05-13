import { NextResponse } from 'next/server';

import AdminAppointmentResponse, {
  subject as adminSubject,
} from '@/emails/admin-appointment-response';
import AppointmentConfirmed, {
  subject as confirmedSubject,
} from '@/emails/appointment-confirmed';
import AppointmentRejected, {
  subject as rejectedSubject,
} from '@/emails/appointment-rejected';
import { sendEmail } from '@/lib/email/resend-client';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const token = searchParams.get('token');
  const action = searchParams.get('action'); // 'accept' ili 'reject'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;
  const redirectUrl = (status: string) =>
    NextResponse.redirect(`${baseUrl}/appointment/response?status=${status}`);

  if (!token || (action !== 'accept' && action !== 'reject')) {
    return redirectUrl('invalid');
  }

  const verification = await prisma.verification.findFirst({
    where: {
      value: token,
      identifier: { startsWith: 'appointment-proposal:' },
    },
  });

  if (!verification) {
    return redirectUrl('invalid');
  }

  if (verification.expiresAt < new Date()) {
    await prisma.verification.delete({ where: { id: verification.id } });
    return redirectUrl('expired');
  }

  const appointmentId = verification.identifier.split(':')[1];

  if (!appointmentId) {
    return redirectUrl('invalid');
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      serviceType: true,
    },
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

  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  const startTime = appointment.proposedStartTime;
  const serviceName = appointment.serviceType?.name ?? null;
  const clinicEmail = process.env.CLINIC_EMAIL;

  if (appointment.email && clinicEmail) {
    const emailProps = { patientName, startTime, serviceName };

    await Promise.all([
      sendEmail({
        to: appointment.email,
        subject: action === 'accept' ? confirmedSubject : rejectedSubject,
        react:
          action === 'accept' ? (
            <AppointmentConfirmed {...emailProps} />
          ) : (
            <AppointmentRejected {...emailProps} reason={null} />
          ),
      }),
      sendEmail({
        to: clinicEmail,
        subject: adminSubject(action, patientName),
        react: <AdminAppointmentResponse action={action} {...emailProps} />,
      }),
    ]);
  }

  return redirectUrl(action === 'accept' ? 'accepted' : 'rejected');
}
