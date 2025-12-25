import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

export const FOOTER_SERVICES = [
  'Opšta stomatologija',
  'Estetska stomatologija',
  'Implantologija',
  'Ortodoncija',
  'Parodontologija',
];

export const FOOTER_QUICK_LINKS = [
  { href: '/', label: 'Početna' },
  { href: '/usluge', label: 'Usluge' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/kontakt', label: 'Kontakt' },
];

export const FOOTER_SOCIAL_LINKS = [
  {
    label: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/dentalcare',
  },
  {
    label: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/dentalcare',
  },
  {
    label: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/dentalcare',
  },
];

export const FOOTER_CONTACT = [
  {
    type: 'address',
    icon: MapPin,
    lines: ['Bulevar Kralja Aleksandra 123', 'Beograd, Srbija'],
  },
  {
    type: 'phone',
    icon: Phone,
    value: '+381 11 123 4567',
    href: 'tel:+381111234567',
  },
  {
    type: 'email',
    icon: Mail,
    value: 'info@dentalcare.rs',
    href: 'mailto:info@dentalcare.rs',
  },
  {
    type: 'hours',
    icon: Clock,
    lines: ['Pon - Pet: 08:00 - 20:00', 'Sub: 09:00 - 14:00'],
  },
];

export const FOOTER_BRAND = {
  name: 'DentalCare',
  description:
    'Vaš osmeh je naša misija. Pružamo vrhunsku stomatološku negu u modernom i opuštajućem okruženju.',
};
