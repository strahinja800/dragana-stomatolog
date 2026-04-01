import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from '@/constants/icons';

export const FOOTER_SERVICE_KEYS = [
  'preventiva',
  'estetska',
  'implantologija',
  'ortodoncija',
  'parodontologija',
] as const;

export const FOOTER_SOCIAL_LINKS = [
  {
    labelKey: 'footerSocial.facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/dentalholist',
  },
  {
    labelKey: 'footerSocial.instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/dentalholist',
  },
  {
    labelKey: 'footerSocial.linkedin',
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/dentalholist',
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
    value: 'info@dentalholist.rs',
    href: 'mailto:info@dentalholist.rs',
  },
  {
    type: 'hours',
    icon: Clock,
    lines: ['Pon - Pet: 08:00 - 20:00', 'Sub: 09:00 - 14:00'],
  },
];
