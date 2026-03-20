// TODO: Placeholder — zamijeni sa pravom React Email komponentom
// Props: { patientName: string, startTime: Date, phone: string | null, symptoms: string | null }

import { Body, Html, Text } from '@react-email/components';

export const subject = 'Novi zahtev za termin';

interface Props {
  patientName: string;
  startTime: Date;
  phone: string | null;
  symptoms: string | null;
}

export default function AdminNewAppointment({ patientName, startTime, phone, symptoms }: Props) {
  return (
    <Html>
      <Body>
        <Text>Novi zahtev za termin stigao je od pacijenta.</Text>
        <Text>Pacijent: {patientName}</Text>
        <Text>Željeni termin: {startTime.toLocaleString('sr-RS')}</Text>
        {phone && <Text>Telefon: {phone}</Text>}
        {symptoms && <Text>Simptomi: {symptoms}</Text>}
      </Body>
    </Html>
  );
}
