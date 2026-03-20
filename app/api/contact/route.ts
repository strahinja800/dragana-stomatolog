import React from 'react';
import { NextResponse } from 'next/server';

import { Body, Html, Section, Text } from '@react-email/components';
import { z } from 'zod';

import { sendEmail } from '@/lib/email/resend-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  service: z.string().min(1),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Nevalidni podaci forme.' },
      { status: 400 }
    );
  }

  const clinicEmail = process.env.CLINIC_EMAIL;

  if (!clinicEmail) {
    return NextResponse.json(
      {
        success: false,
        message: 'Kontakt servis nije konfigurisan. Pokušajte kasnije.',
      },
      { status: 503 }
    );
  }

  const { firstName, lastName, email, phone, service, message } = parsed.data;
  const fullName = `${firstName} ${lastName}`;

  const emailResult = await sendEmail({
    to: clinicEmail,
    subject: `Novi kontakt upit: ${fullName}`,
    react: React.createElement(
      Html,
      null,
      React.createElement(
        Body,
        null,
        React.createElement(
          Section,
          null,
          React.createElement(Text, null, `Ime i prezime: ${fullName}`),
          React.createElement(Text, null, `Email: ${email}`),
          React.createElement(Text, null, `Telefon: ${phone}`),
          React.createElement(Text, null, `Usluga: ${service}`),
          React.createElement(Text, null, `Poruka:`),
          React.createElement(Text, null, message)
        )
      )
    ),
  });

  if (!emailResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: emailResult.message ?? 'Slanje poruke nije uspelo.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
