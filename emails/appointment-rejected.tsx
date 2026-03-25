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

export const subject = 'Vaš zahtev za termin je odbijen';

interface Props {
  patientName: string;
  startTime: Date;
  reason: string | null;
}

export default function AppointmentRejected({
  patientName = 'Marko Marković',
  startTime = new Date('2026-03-25T10:00:00'),
  reason = 'Zauzet termin',
}: Props) {
  return (
    <Html lang="sr">
      <Head />
      <Preview>Nažalost, vaš zahtev za termin nije odobren.</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Zahtev nije odobren
          </Heading>
          <Text style={s.text}>Poštovani/a {patientName},</Text>
          <Text style={s.text}>
            Nažalost, nismo u mogućnosti da potvrdimo vaš zahtev za termin.
            Pozivamo vas da nas kontaktirate radi dogovora o novom terminu.
          </Text>
          <Section style={detailBox}>
            <Text style={detailLabel}>Traženi termin</Text>
            <Text style={detailValue}>
              {format(startTime, 'dd.MM.yyyy. HH:mm')}
            </Text>
            {reason && (
              <>
                <Text style={detailLabel}>Razlog</Text>
                <Text style={detailValue}>{reason}</Text>
              </>
            )}
          </Section>
          <Hr style={s.hr} />
          <Text style={s.footer}>Stomatološka ordinacija Dr. Dragana</Text>
        </Container>
      </Body>
    </Html>
  );
}

const detailBox = {
  backgroundColor: '#fdf2f2',
  borderLeft: '4px solid #c0392b',
  padding: '16px 20px',
  borderRadius: '4px',
  margin: '24px 0',
};

const detailLabel = {
  fontSize: '12px',
  color: '#888888',
  margin: '12px 0 2px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailValue = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0',
};
