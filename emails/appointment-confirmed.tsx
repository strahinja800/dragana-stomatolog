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

export const subject = 'Vaš termin je potvrđen';

interface Props {
  patientName: string;
  startTime: Date;
  serviceName: string | null;
}

export default function AppointmentConfirmed({
  patientName = 'Marko Marković',
  startTime = new Date('2026-03-25T10:00:00'),
  serviceName = 'Pregled',
}: Props) {
  return (
    <Html lang="sr">
      <Head />
      <Preview>
        Vaš termin je potvrđen — vidimo se {format(startTime, 'dd.MM.yyyy.')}.
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Termin potvrđen
          </Heading>
          <Text style={s.text}>Poštovani/a {patientName},</Text>
          <Text style={s.text}>
            Vaš termin je potvrđen. Radujemo se vašem dolasku.
          </Text>
          <Section style={detailBox}>
            <Text style={detailLabel}>Datum i vreme</Text>
            <Text style={detailValue}>
              {format(startTime, 'dd.MM.yyyy. HH:mm')}
            </Text>
            {serviceName && (
              <>
                <Text style={detailLabel}>Usluga</Text>
                <Text style={detailValue}>{serviceName}</Text>
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
  backgroundColor: '#f0f9f4',
  borderLeft: '4px solid #2e7d5e',
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
