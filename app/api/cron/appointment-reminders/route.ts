import React from 'react';
import { NextResponse } from 'next/server';

import { addHours } from 'date-fns';

import AppointmentReminder, {
  subject as appointmentReminderSubject,
} from '@/emails/appointment-reminder';
import { sendEmail } from '@/lib/email/resend-client';
import { prisma } from '@/lib/prisma';

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

    const patientName =
      `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim() ||
      'Pacijent';

    const emailResult = await sendEmail({
      to: appointment.email,
      subject: appointmentReminderSubject,
      react: React.createElement(AppointmentReminder, {
        patientName,
        startTime: appointment.startTime,
        serviceName: appointment.serviceType?.name ?? null,
      }),
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
