import {
  Body,
  Button,
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

export const subject = 'Predlog novog termina — Vaš odgovor je potreban';

interface Props {
  patientName: string;
  proposedStartTime: Date;
  acceptUrl: string;
  rejectUrl: string;
}

export default function AppointmentTimeProposal({
  patientName = 'Marko Marković',
  proposedStartTime = new Date('2026-03-25T10:00:00'),
  acceptUrl = 'http://localhost:3000/api/appointment/response?token=test&action=accept',
  rejectUrl = 'http://localhost:3000/api/appointment/response?token=test&action=reject',
}: Props) {
  return (
    <Html lang="sr">
      <Head />
      <Preview>
        Predlažemo vam novi termin — {format(proposedStartTime, 'dd.MM.yyyy.')}.
        Potvrdite vaš odgovor.
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Predlog novog termina
          </Heading>
          <Text style={s.text}>Poštovani/a {patientName},</Text>
          <Text style={s.text}>
            Nažalost, vaš prvobitno željeni termin nije dostupan. Predlažemo vam
            sledeći slobodan termin:
          </Text>
          <Section style={detailBox}>
            <Text style={detailLabel}>Predloženi termin</Text>
            <Text style={detailValue}>
              {format(proposedStartTime, 'dd.MM.yyyy. HH:mm')}
            </Text>
          </Section>
          <Text style={s.text}>
            Molimo vas da nam potvrdite da li vam ovaj termin odgovara:
          </Text>
          <Section>
            <Button href={acceptUrl} style={acceptButton}>
              Prihvatam
            </Button>
            <Button href={rejectUrl} style={rejectButton}>
              Ne odgovara mi
            </Button>
          </Section>
          <Text style={note}>
            Linkovi važe 72 sata. Ukoliko nijedno dugme ne odgovara,
            kontaktirajte nas direktno.
          </Text>
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

const acceptButton = {
  backgroundColor: '#2e7d5e',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '14px',
  textDecoration: 'none',
  marginRight: '12px',
  display: 'inline-block',
};

const rejectButton = {
  backgroundColor: '#f0f0f0',
  color: '#444444',
  padding: '12px 24px',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-block',
};

const note = {
  fontSize: '12px',
  color: '#aaaaaa',
  margin: '16px 0 0',
};
