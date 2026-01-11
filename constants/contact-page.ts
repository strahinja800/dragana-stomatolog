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
    content: 'info@dentalcare.rs',
    link: 'mailto:info@dentalcare.rs',
  },
  {
    icon: MapPin,
    title: 'Adresa',
    content: 'Bulevar Kralja Aleksandra 123, Beograd',
    link: 'https://maps.google.com',
  },
  {
    icon: Clock,
    title: 'Radno vreme',
    content: 'Pon-Pet: 08-20h, Sub: 09-14h',
    link: null,
  },
];
