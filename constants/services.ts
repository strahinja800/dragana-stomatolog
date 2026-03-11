import {
  Clock,
  Heart,
  Pill,
  Shield,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
} from '@/constants/icons';

export const SERVICES = [
  {
    icon: Shield,
    title: 'Preventivna stomatologija',
    description:
      'Redovni pregledi i profesionalno čišćenje zuba za dugotrajno zdravlje.',
    features: [
      'Sistematski pregledi',
      'Čišćenje kamenca',
      'Fluoridacija',
      'Rendgen snimci',
    ],
  },
  {
    icon: Sparkles,
    title: 'Estetska stomatologija',
    description:
      'Izbeljivanje, fasete i kompletna transformacija vašeg osmeha.',
    features: [
      'Izbeljivanje zuba',
      'Keramičke fasete',
      'Bonding',
      'Smile makeover',
    ],
  },
  {
    icon: Heart,
    title: 'Implantologija',
    description: 'Moderna ugradnja implantata za prirodan izgled i funkciju.',
    features: [
      'Zubni implantati',
      'All-on-4',
      'Koštana augmentacija',
      'Mini implantati',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Ortodoncija',
    description: 'Ispravljanje zuba za savršen osmeh u svakom uzrastu.',
    features: ['Fiksne proteze', 'Invisalign', 'Mobilni aparati', 'Retejneri'],
  },
  {
    icon: Syringe,
    title: 'Endodoncija',
    description: 'Lečenje kanala korena zuba sa najmodernijom opremom.',
    features: [
      'Lečenje kanala',
      'Retreatment',
      'Apikotomija',
      'Mikroskopska endodoncija',
    ],
  },
  {
    icon: Pill,
    title: 'Parodontologija',
    description: 'Lečenje desni i održavanje zdravlja potpornog tkiva zuba.',
    features: [
      'Duboko čišćenje',
      'Lečenje desni',
      'Regeneracija tkiva',
      'Održavanje',
    ],
  },
  {
    icon: Smile,
    title: 'Dečja stomatologija',
    description: 'Nežna nega za najmlađe u prijatnom okruženju.',
    features: [
      'Preventiva za decu',
      'Zalivanje fisura',
      'Mlečni zubi',
      'Navikavanje',
    ],
  },
  {
    icon: Clock,
    title: 'Hitna pomoć',
    description: 'Brza pomoć za bol u zubima i hitne situacije.',
    features: ['Bol u zubima', 'Slomljeni zubi', 'Ispale plombe', 'Otekline'],
  },
];
