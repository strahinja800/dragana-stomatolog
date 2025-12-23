import { Sparkles, Shield, Heart, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-dental.jpg';
import dentist1 from '@/assets/dentist-1.jpg';
import dentist2 from '@/assets/dentist-2.jpg';
import portfolio1 from '@/assets/portfolio-1.png';
import portfolio2 from '@/assets/portfolio-2.png';
import portfolio3 from '@/assets/portfolio-3.png';
import portfolio4 from '@/assets/portfolio-4.png';
import portfolio5 from '@/assets/portfolio-5.png';

export const portfolioItems = [
  {
    number: '01',
    title: 'Preventivna nega',
    description: 'Kompletna briga o zdravlju vaših zuba',
    image: portfolio1,
  },
  {
    number: '02',
    title: 'Implantologija',
    description: 'Najsavremeniji zubni implantati',
    image: portfolio2,
  },
  {
    number: '03',
    title: 'Dijagnostika',
    description: 'Precizna analiza i planiranje lečenja',
    image: portfolio3,
  },
  {
    number: '04',
    title: 'Ortodoncija',
    description: 'Ispravljanje vilice i zuba',
    image: portfolio4,
  },
  {
    number: '05',
    title: 'Protetika',
    description: 'Kvalitetne krunice i mostovi',
    image: portfolio5,
  },
];

export const services = [
  {
    icon: Sparkles,
    title: 'Estetska stomatologija',
    description: 'Izbeljivanje zuba, fasete i kompletna transformacija osmeha.',
  },
  {
    icon: Shield,
    title: 'Preventivna nega',
    description: 'Redovni pregledi, čišćenje i fluoridacija za zdravlje zuba.',
  },
  {
    icon: Heart,
    title: 'Implantologija',
    description: 'Moderna ugradnja implantata za savršen i trajan osmeh.',
  },
  {
    icon: Clock,
    title: 'Hitna pomoć',
    description: 'Brza pomoć za bol u zubima i hitne stomatološke situacije.',
  },
];

export const testimonials = [
  {
    name: 'Marija Petrović',
    role: 'Pacijent od 2019',
    content:
      'Neverovatno iskustvo! Tim DentalCare-a me je potpuno opustio i učinio da se osećam kao kod kuće. Moj osmeh nikada nije izgledao bolje.',
    rating: 5,
  },
  {
    name: 'Stefan Jovanović',
    role: 'Pacijent od 2021',
    content:
      'Profesionalizam na najvišem nivou. Implantat koji sam dobio izgleda potpuno prirodno. Preporučujem svima!',
    rating: 5,
  },
  {
    name: 'Ana Nikolić',
    role: 'Pacijent od 2020',
    content:
      'Konačno zubar od koga se ne plašim! Atmosfera je opuštajuća, a rezultati fantastični. Hvala vam!',
    rating: 5,
  },
];

export const team = [
  {
    name: 'Dr. Ana Jovanović',
    role: 'Glavna stomatologinja',
    specialty: 'Estetska stomatologija',
    image: dentist1,
  },
  {
    name: 'Dr. Marko Petrović',
    role: 'Oralni hirurg',
    specialty: 'Implantologija',
    image: dentist2,
  },
  {
    name: 'Dr. Jelena Marković',
    role: 'Ortodont',
    specialty: 'Fiksne proteze',
    image: dentist1,
  },
  {
    name: 'Dr. Nikola Stanković',
    role: 'Endodontista',
    specialty: 'Lečenje kanala',
    image: dentist2,
  },
];

export const blogPosts = [
  {
    title: '5 saveta za blistav osmeh',
    excerpt:
      'Otkrijte jednostavne navike koje će transformisati vaš osmeh i poboljšati oralno zdravlje.',
    date: '5. Dec 2024',
    category: 'Saveti',
    image: heroImage,
  },
  {
    title: 'Zašto su redovni pregledi važni?',
    excerpt:
      'Preventivna nega je ključ za zdrave zube. Saznajte zašto ne treba preskakati preglede.',
    date: '28. Nov 2024',
    category: 'Zdravlje',
    image: dentist1,
  },
  {
    title: 'Moderna implantologija',
    excerpt:
      'Sve što treba da znate o zubnim implantatima i procesu njihove ugradnje.',
    date: '15. Nov 2024',
    category: 'Tretmani',
    image: dentist2,
  },
];

export const features = [
  'Najsavremenija oprema',
  'Bezbolni tretmani',
  'Fleksibilno zakazivanje',
  'Porodična stomatologija',
];

export { heroImage, dentist1, dentist2 };
