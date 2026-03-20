// TODO: Placeholder — zamijeni sa pravom React Email komponentom
// Props: { patientName: string, startTime: Date, reason: string | null }

import { Body, Html, Text } from '@react-email/components';

export const subject = 'Vaš zahtev za termin je odbijen';

interface Props {
  patientName: string;
  startTime: Date;
  reason: string | null;
}

export default function AppointmentRejected({ patientName, startTime, reason }: Props) {
  return (
    <Html>
      <Body>
        <Text>Poštovani/a {patientName},</Text>
        <Text>Nažalost, vaš zahtev za termin ({startTime.toLocaleString('sr-RS')}) nije odobren.</Text>
        {reason && <Text>Razlog: {reason}</Text>}
      </Body>
    </Html>
  );
}
