import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';

import * as s from './email-styles';

export const subject = 'Primili smo vaš zahtev za termin';

interface Props {
  patientName: string;
  startTime: Date;
}

export default function AppointmentBookingReceived({
  patientName = 'Marko Marković',
  startTime = new Date('2026-03-25T10:00:00'),
}: Props) {
  return (
    <Html lang="sr">
      <Head />
      <Preview>
        Primili smo vaš zahtev za termin — uskoro ćemo vas kontaktirati.
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Zahtev za termin primljen
          </Heading>
          <Text style={s.text}>Poštovani/a {patientName},</Text>
          <Text style={s.text}>
            Primili smo vaš zahtev za termin i uskoro ćemo vas kontaktirati radi
            potvrde.
          </Text>
          <Section style={detailBox}>
            <Text style={detailLabel}>Željeni termin</Text>
            <Text style={detailValue}>
              {format(startTime, 'dd.MM.yyyy. HH:mm')}
            </Text>
          </Section>
          <Hr style={s.hr} />
          <Text style={s.footer}>Stomatološka ordinacija Dr. Dragana</Text>
        </Container>
      </Body>
    </Html>
  );
}

const detailBox = {
  backgroundColor: '#f0f9f4',
  borderLeft: '4px solid #2e7d5e',
  padding: '16px 20px',
  borderRadius: '4px',
  margin: '24px 0',
};

const detailLabel = {
  fontSize: '12px',
  color: '#888888',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailValue = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0',
};
