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

export const subject = 'Novi zahtev za termin';

interface Props {
  patientName: string;
  startTime: Date;
  phone: string | null;
  symptoms: string | null;
}

export default function AdminNewAppointment({
  patientName = 'Marko Marković',
  startTime = new Date('2026-03-25T10:00:00'),
  phone = '+381 64 123 4567',
  symptoms = 'Bol u zubu',
}: Props) {
  return (
    <Html lang="sr">
      <Head />
      <Preview>Novi zahtev za termin od {patientName}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Novi zahtev za termin
          </Heading>
          <Text style={s.text}>
            Stigao je novi zahtev za termin putem sajta.
          </Text>
          <Section style={detailBox}>
            <Text style={detailLabel}>Pacijent</Text>
            <Text style={detailValue}>{patientName}</Text>
            <Text style={detailLabel}>Željeni termin</Text>
            <Text style={detailValue}>
              {format(startTime, 'dd.MM.yyyy. HH:mm')}
            </Text>
            {phone && (
              <>
                <Text style={detailLabel}>Telefon</Text>
                <Text style={detailValue}>{phone}</Text>
              </>
            )}
            {symptoms && (
              <>
                <Text style={detailLabel}>Simptomi</Text>
                <Text style={detailValue}>{symptoms}</Text>
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
  backgroundColor: '#f0f4f9',
  borderLeft: '4px solid #2e5d9e',
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
