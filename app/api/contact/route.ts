import { NextResponse } from 'next/server';

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
    text: `Ime i prezime: ${fullName}\nEmail: ${email}\nTelefon: ${phone}\nUsluga: ${service}\n\nPoruka:\n${message}`,
    html: `
      <div style="font-family: Ebrima, Arial, sans-serif; color:#1c2a2f; line-height:1.6;">
        <h2>Novi kontakt upit</h2>
        <p><strong>Ime i prezime:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Usluga:</strong> ${service}</p>
        <p><strong>Poruka:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
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
