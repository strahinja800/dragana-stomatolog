import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Telefon',
    content: '+381 11 123 4567',
    link: 'tel:+381111234567',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'info@dentalholist.rs',
    link: 'mailto:info@dentalholist.rs',
  },
  {
    icon: MapPin,
    title: 'Adresa',
    content: 'Bulevar Kralja Aleksandra 123, Beograd',
    link: 'https://maps.google.com/?q=Bulevar+Kralja+Aleksandra+123+Beograd',
  },
  {
    icon: Clock,
    title: 'Radno vreme',
    content: 'Pon-Pet: 08:00-20:00, Sub: 09:00-14:00',
    link: null,
  },
];
