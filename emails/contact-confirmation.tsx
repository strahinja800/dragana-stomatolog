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

import * as s from './email-styles';

export const subject = 'Vaš zahtev je primljen';

interface Props {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

export default function ContactConfirmation({
  firstName = 'Marko',
  lastName = 'Marković',
  email = 'marko@example.com',
  phone = '060 123 4567',
  service = 'Pregled',
  message = 'Zanima me više informacija.',
}: Props) {
  const fullName = `${firstName} ${lastName}`;

  return (
    <Html lang="sr">
      <Head />
      <Preview>
        Vaš zahtev je uspešno primljen — kontaktiraćemo vas uskoro.
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Zahtev je uspešno primljen
          </Heading>
          <Text style={s.text}>Poštovani/a {fullName},</Text>
          <Text style={s.text}>
            Vaš zahtev je uspešno primljen. Kontaktiraćemo vas u najkraćem
            mogućem roku.
          </Text>
          <Section style={detailBox}>
            <Text style={detailLabel}>Email</Text>
            <Text style={detailValue}>{email}</Text>
            <Text style={detailLabel}>Telefon</Text>
            <Text style={detailValue}>{phone}</Text>
            <Text style={detailLabel}>Usluga</Text>
            <Text style={detailValue}>{service}</Text>
            <Text style={detailLabel}>Poruka</Text>
            <Text style={detailValue}>{message}</Text>
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
  color: '#1a1a1a',
  margin: '0 0 8px',
};
