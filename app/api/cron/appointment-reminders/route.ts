import { NextResponse } from 'next/server';

import { addHours } from 'date-fns';

import { sendEmail } from '@/lib/email/resend-client';
import { prisma } from '@/lib/prisma';
import { getAppointmentReminderEmail } from '@/module/appointment/server/appointment-email-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return false;
  }

  const authHeader = request.headers.get('authorization');
  const secretHeader = request.headers.get('x-cron-secret');
  const bearer = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  return bearer === expected || secretHeader === expected;
}

async function processReminders() {
  const now = new Date();
  const windowStart = addHours(now, 23);
  const windowEnd = addHours(now, 25);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'CONFIRMED',
      reminderSent: false,
      email: {
        not: null,
      },
      startTime: {
        gte: windowStart,
        lte: windowEnd,
      },
    },
    include: {
      patient: true,
      serviceType: true,
    },
  });

  let sent = 0;
  const failures: { appointmentId: string; reason: string }[] = [];

  for (const appointment of appointments) {
    if (!appointment.email) {
      continue;
    }

    const payload = getAppointmentReminderEmail({
      patientName:
        `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim() ||
        'Pacijent',
      startTime: appointment.startTime,
      serviceName: appointment.serviceType?.name,
    });

    const emailResult = await sendEmail({
      to: appointment.email,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    if (!emailResult.success) {
      failures.push({
        appointmentId: appointment.id,
        reason: emailResult.message ?? 'Unknown email failure',
      });
      continue;
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        reminderSent: true,
        reminderSentAt: new Date(),
      },
    });

    sent += 1;
  }

  return {
    checked: appointments.length,
    sent,
    failed: failures.length,
    failures,
    window: {
      from: windowStart.toISOString(),
      to: windowEnd.toISOString(),
    },
  };
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const result = await processReminders();

  return NextResponse.json({ success: true, ...result });
}

export async function GET(request: Request) {
  return POST(request);
}
