import { NextResponse } from 'next/server';

import { z } from 'zod';

import ContactConfirmation, {
  subject as confirmationSubject,
} from '@/emails/contact-confirmation';
import ContactInquiry, {
  subject as inquirySubject,
} from '@/emails/contact-inquiry';
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
  const props = { firstName, lastName, email, phone, service, message };

  const [clinicResult, senderResult] = await Promise.all([
    sendEmail({
      to: clinicEmail,
      subject: inquirySubject(fullName),
      react: <ContactInquiry {...props} />,
    }),
    sendEmail({
      to: email,
      subject: confirmationSubject,
      react: <ContactConfirmation {...props} />,
    }),
  ]);

  if (!clinicResult.success || !senderResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Slanje poruke nije uspelo.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
