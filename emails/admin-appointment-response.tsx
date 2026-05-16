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

export const subject = (action: 'accept' | 'reject', patientName: string) =>
  action === 'accept'
    ? `Pacijent je prihvatio termin — ${patientName}`
    : `Pacijent je odbio termin — ${patientName}`;

interface Props {
  action?: 'accept' | 'reject';
  patientName?: string;
  startTime?: Date;
  serviceName?: string | null;
}

export default function AdminAppointmentResponse({
  action = 'accept',
  patientName = 'Marko Marković',
  startTime = new Date('2026-03-25T10:00:00'),
  serviceName = 'Pregled',
}: Props) {
  const accepted = action === 'accept';

  return (
    <Html lang="sr">
      <Head />
      <Preview>
        {accepted
          ? `${patientName} je prihvatio/la predloženi termin.`
          : `${patientName} je odbio/la predloženi termin.`}
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            {accepted ? 'Termin prihvaćen' : 'Termin odbijen'}
          </Heading>
          <Text style={s.text}>
            {accepted
              ? `Pacijent ${patientName} je prihvatio/la predloženi termin.`
              : `Pacijent ${patientName} je odbio/la predloženi termin.`}
          </Text>
          <Section style={accepted ? acceptBox : rejectBox}>
            <Text style={detailLabel}>Pacijent</Text>
            <Text style={detailValue}>{patientName}</Text>
            <Text style={detailLabel}>Termin</Text>
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

const acceptBox = {
  backgroundColor: '#f0f9f4',
  borderLeft: '4px solid #2e7d5e',
  padding: '16px 20px',
  borderRadius: '4px',
  margin: '24px 0',
};

const rejectBox = {
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
  fontWeight: '600' as const,
  color: '#1a1a1a',
  margin: '0',
};
