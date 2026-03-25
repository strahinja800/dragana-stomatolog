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

export const subject = 'Podsetnik: vaš termin je sutra';

interface Props {
  patientName: string;
  startTime: Date;
  serviceName: string | null;
}

export default function AppointmentReminder({
  patientName = 'Marko Marković',
  startTime = new Date('2026-03-25T10:00:00'),
  serviceName = 'Redovni pregled',
}: Props) {
  return (
    <Html lang="sr">
      <Head />
      <Preview>
        Podsetnik: sutra u {format(startTime, 'HH:mm')} imate termin kod nas.
      </Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Heading as="h1" style={s.heading}>
            Podsetnik za sutrašnji termin
          </Heading>
          <Text style={s.text}>Poštovani/a {patientName},</Text>
          <Text style={s.text}>
            Podsjećamo vas da imate zakazan termin sutra. Molimo vas da budete
            na vreme ili nas kontaktirate ukoliko niste u mogućnosti da dođete.
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
  backgroundColor: '#fffbf0',
  borderLeft: '4px solid #e6a817',
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
