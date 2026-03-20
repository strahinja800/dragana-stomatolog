// TODO: Placeholder — zamijeni sa pravom React Email komponentom
// Props: { patientName: string, startTime: Date, serviceName: string | null }

import { Body, Html, Text } from '@react-email/components';

export const subject = 'Podsetnik: vaš termin je sutra';

interface Props {
  patientName: string;
  startTime: Date;
  serviceName: string | null;
}

export default function AppointmentReminder({ patientName, startTime, serviceName }: Props) {
  return (
    <Html>
      <Body>
        <Text>Poštovani/a {patientName},</Text>
        <Text>Podsetnik: vaš termin je zakazan za {startTime.toLocaleString('sr-RS')}.</Text>
        {serviceName && <Text>Usluga: {serviceName}</Text>}
      </Body>
    </Html>
  );
}
