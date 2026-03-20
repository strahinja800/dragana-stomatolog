// TODO: Placeholder — zamijeni sa pravom React Email komponentom
// Props: { patientName: string, startTime: Date, serviceName: string | null }

import { Body, Html, Text } from '@react-email/components';

export const subject = 'Vaš termin je potvrđen';

interface Props {
  patientName: string;
  startTime: Date;
  serviceName: string | null;
}

export default function AppointmentConfirmed({ patientName, startTime, serviceName }: Props) {
  return (
    <Html>
      <Body>
        <Text>Poštovani/a {patientName},</Text>
        <Text>Vaš termin je potvrđen.</Text>
        <Text>Datum i vreme: {startTime.toLocaleString('sr-RS')}</Text>
        {serviceName && <Text>Usluga: {serviceName}</Text>}
      </Body>
    </Html>
  );
}
