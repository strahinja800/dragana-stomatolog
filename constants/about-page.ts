import { Award, Heart, Sparkles, Users } from 'lucide-react';

import { dentist1, dentist2 } from '@/data/data';

export const VALUES = [
  {
    icon: Heart,
    title: 'Briga o pacijentima',
    description:
      'Vaše zdravlje i komfor su nam na prvom mestu. Svaki pacijent dobija punu pažnju i individualnu negu.',
  },
  {
    icon: Award,
    title: 'Stručnost',
    description:
      'Naš tim stalno usavršava znanja i prati najnovije trendove u stomatologiji.',
  },
  {
    icon: Users,
    title: 'Porodična atmosfera',
    description:
      'Trudimo se da se svaki pacijent oseća dobrodošlo i opušteno u našoj ordinaciji.',
  },
  {
    icon: Sparkles,
    title: 'Moderna tehnologija',
    description:
      'Koristimo najsavremeniju opremu za precizne dijagnoze i bezbolne tretmane.',
  },
];

export const TEAM = [
  {
    name: 'Dr. Ana Jovanović',
    role: 'Glavni stomatolog',
    specialty: 'Estetska stomatologija',
    image: dentist1,
    bio: 'Sa preko 12 godina iskustva, Dr. Ana je specijalista za estetske zahvate i vodi naš tim sa strašću za savršene osmeha.',
  },
  {
    name: 'Dr. Marko Petrović',
    role: 'Oralni hirurg',
    specialty: 'Implantologija',
    image: dentist2,
    bio: 'Specijalizovan za implantologiju i oralnu hirurgiju, Dr. Marko donosi preciznost i inovacije u svaki zahvat.',
  },
];

export const MILESTONES = [
  {
    year: '2009',
    title: 'Osnivanje',
    description: 'Otvorena prva ordinacija u centru Beograda',
  },
  {
    year: '2013',
    title: 'Proširenje',
    description: 'Dodati novi specijalisti i moderne opreme',
  },
  {
    year: '2017',
    title: 'Digitalizacija',
    description: 'Uvođenje 3D skenera i digitalnog planiranja',
  },
  {
    year: '2021',
    title: 'Nova lokacija',
    description: 'Preseljenje u moderni prostor od 300m²',
  },
  {
    year: '2024',
    title: '10,000+ pacijenata',
    description: 'Dostignuto 10,000 zadovoljnih pacijenata',
  },
];
