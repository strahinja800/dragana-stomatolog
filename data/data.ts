import {
  BellRing,
  CalendarClock,
  CircleCheckBig,
  Shield,
} from '@/constants/icons';
import case1After from '@/public/assets/case-1-after.jpg';
import case1Before from '@/public/assets/case-1-before.jpg';
import case2After from '@/public/assets/case-2-after.jpg';
import case2Before from '@/public/assets/case-2-before.jpg';
import case3After from '@/public/assets/case-3-after.jpg';
import case3Before from '@/public/assets/case-3-before.jpg';
import logoGoldTransparent from '@/public/assets/dentalholist-logo-gold-transparent.svg';
import logoHorizontal from '@/public/assets/dentalholist-logo-horizontal.svg';
import logoIcon from '@/public/assets/dentalholist-logo-icon.svg';
import logoText from '@/public/assets/dentalholist-logo-text.svg';
import heroImage from '@/public/assets/hero-dental-realistic.jpg';
import logoNegativ from '@/public/assets/logo-negativ.jpg';
import serviceDiagnostics from '@/public/assets/service-diagnostics.jpg';
import serviceImplantology from '@/public/assets/service-implantology.jpg';
import serviceOrthodontics from '@/public/assets/service-orthodontics.jpg';
import servicePreventive from '@/public/assets/service-preventive.jpg';
import serviceProsthetics from '@/public/assets/service-prosthetics.jpg';
import teamDoctor1 from '@/public/assets/team-doctor-1.jpg';
import teamDoctor2 from '@/public/assets/team-doctor-2.jpg';
import teamDoctor3 from '@/public/assets/team-doctor-3.jpg';
import teamDoctor4 from '@/public/assets/team-doctor-4.jpg';

export const portfolioItems = [
  {
    number: '01',
    title: 'Preventivna nega',
    description: 'Kompletna zaštita i održavanje zdravog osmeha.',
    image: servicePreventive,
  },
  {
    number: '02',
    title: 'Implantologija',
    description: 'Precizna i dugotrajna implantološka rešenja.',
    image: serviceImplantology,
  },
  {
    number: '03',
    title: 'Digitalna dijagnostika',
    description: 'Tačno planiranje terapije uz savremenu tehnologiju.',
    image: serviceDiagnostics,
  },
  {
    number: '04',
    title: 'Ortodoncija',
    description: 'Funkcionalno i estetsko ispravljanje zuba.',
    image: serviceOrthodontics,
  },
  {
    number: '05',
    title: 'Protetika',
    description: 'Krunice, mostovi i rešenja prirodnog izgleda.',
    image: serviceProsthetics,
  },
];

export const services = [
  {
    icon: CircleCheckBig,
    title: 'Estetska stomatologija',
    description: 'Izbeljivanje zuba, fasete i potpuna transformacija osmeha.',
  },
  {
    icon: Shield,
    title: 'Preventivna nega',
    description: 'Kontrole i profesionalna higijena za dugoročno zdravlje.',
  },
  {
    icon: CalendarClock,
    title: 'Implantologija',
    description: 'Savremena ugradnja implantata uz digitalno planiranje.',
  },
  {
    icon: BellRing,
    title: 'Kontrolni podsetnici',
    description: 'Email potvrde i automatski podsetnici za naredni pregled.',
  },
];

export const testimonials = [
  {
    name: 'Marija Petrović',
    role: 'Pacijent od 2019.',
    content:
      'Prvi put sam imala osećaj da stomatologija može biti potpuno mirno i premium iskustvo. Sve je jasno, profesionalno i bez stresa.',
    rating: 5,
  },
  {
    name: 'Stefan Jovanović',
    role: 'Pacijent od 2021.',
    content:
      'Plan terapije je bio detaljan, a rezultat iznad očekivanja. Komunikacija i podsetnici su mi mnogo olakšali celu proceduru.',
    rating: 5,
  },
  {
    name: 'Ana Nikolić',
    role: 'Pacijent od 2020.',
    content:
      'Od prvog kontakta do kontrole sve je bilo organizovano besprekorno. Tim je stručan, pažljiv i potpuno posvećen pacijentu.',
    rating: 5,
  },
];

export const team = [
  {
    name: 'Dr. Ana Jovanović',
    role: 'Glavni stomatolog',
    specialty: 'Estetska stomatologija',
    image: teamDoctor1,
  },
  {
    name: 'Dr. Marko Petrović',
    role: 'Oralni hirurg',
    specialty: 'Implantologija',
    image: teamDoctor2,
  },
  {
    name: 'Dr. Jelena Marković',
    role: 'Specijalista ortodoncije',
    specialty: 'Fiksna i providna ortodoncija',
    image: teamDoctor3,
  },
  {
    name: 'Dr. Nikola Stanković',
    role: 'Specijalista endodoncije',
    specialty: 'Mikroskopsko lečenje kanala',
    image: teamDoctor4,
  },
];

export const beforeAfterCases = [
  {
    title: 'Estetska rekonstrukcija prednjih zuba',
    summary: 'Kombinacija faseta i minimalno invazivne preparacije.',
    beforeImage: case1Before,
    afterImage: case1After,
    beforeLabel: 'PRE',
    afterLabel: 'POSLE',
  },
  {
    title: 'Implantološka rehabilitacija',
    summary: 'Povrat funkcije i prirodnog izgleda osmeha.',
    beforeImage: case2Before,
    afterImage: case2After,
    beforeLabel: 'PRE',
    afterLabel: 'POSLE',
  },
  {
    title: 'Profesionalna oralna rehabilitacija',
    summary: 'Konzervativni pristup sa dugoročnim planom kontrole.',
    beforeImage: case3Before,
    afterImage: case3After,
    beforeLabel: 'PRE',
    afterLabel: 'POSLE',
  },
];

export const bookingProcessSteps = [
  {
    step: '01',
    title: 'Online zakazivanje',
    description:
      'Izaberite datum i vreme koje vam odgovara i pošaljite zahtev u manje od jednog minuta.',
  },
  {
    step: '02',
    title: 'Email potvrda termina',
    description:
      'Nakon potvrde od strane ordinacije dobijate detalje termina na email.',
  },
  {
    step: '03',
    title: 'Podsetnik 24h pre pregleda',
    description:
      'Automatski email podsetnik vam pomaže da ne propustite kontrolu.',
  },
];

export const homeFaqItems = [
  {
    question: 'Da li mogu da zakažem termin van radnog vremena?',
    answer:
      'Online formu možete popuniti 24/7, a potvrdu termina dobijate čim tim obradi zahtev.',
  },
  {
    question: 'Koliko unapred stiže podsetnik za termin?',
    answer: 'Podsetnik stiže email-om 24 sata pre potvrđenog termina.',
  },
  {
    question: 'Da li je prva konsultacija obavezna?',
    answer:
      'Da, inicijalna konsultacija omogućava da kreiramo precizan i individualan plan terapije.',
  },
  {
    question: 'Da li postoji plan plaćanja za veće terapije?',
    answer:
      'Za kompleksnije terapije nudimo fazni plan i transparentnu procenu troškova.',
  },
];

export const features = [
  'Savremena dijagnostika',
  'Bezbedni i nežni tretmani',
  'Online zakazivanje i podsetnici',
  'Personalizovan plan terapije',
];

export {
  teamDoctor1 as dentist1,
  teamDoctor2 as dentist2,
  heroImage,
  logoGoldTransparent,
  logoHorizontal,
  logoIcon,
  logoNegativ,
  logoText,
  teamDoctor1,
  teamDoctor2,
  teamDoctor3,
  teamDoctor4,
};
