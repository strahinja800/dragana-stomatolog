// TODO: Placeholder — zamijeni sa pravom React Email komponentom
// Props: { patientName: string, startTime: Date }

import { Body, Html, Text } from '@react-email/components';

export const subject = 'Primili smo vaš zahtev za termin';

interface Props {
  patientName: string;
  startTime: Date;
}

export default function AppointmentBookingReceived({ patientName, startTime }: Props) {
  return (
    <Html>
      <Body>
        <Text>Poštovani/a {patientName},</Text>
        <Text>Primili smo vaš zahtev za termin.</Text>
        <Text>Željeni termin: {startTime.toLocaleString('sr-RS')}</Text>
      </Body>
    </Html>
  );
}
