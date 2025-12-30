# DentalCare - Stomatološka ordinacija

Moderni website za stomatološku ordinaciju izrađen u Next.js 16 sa React 19 i Tailwind CSS 4.

## Tech Stack

- **Next.js 16** - App Router, React Server Components
- **React 19** - Najnovija verzija React-a
- **TypeScript 5** - Striktna tipizacija
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Radix-based komponente
- **react-hook-form** - Upravljanje formama

## Pokretanje

```bash
# Instalacija
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Struktura projekta

```
app/                    # Next.js App Router
  (public)/             # Javne stranice
module/                 # Feature moduli
  public/
    home/components/    # Home sekcije
    services/views/     # Usluge stranica
    shared/components/  # Navbar, Footer
components/ui/          # shadcn komponente
constants/              # Navigacija, usluge, statistika
assets/                 # Slike
```

## Dostupne komande

| Komanda            | Opis                       |
| ------------------ | -------------------------- |
| `npm run dev`      | Development server         |
| `npm run build`    | Production build           |
| `npm run lint`     | ESLint provera             |
| `npm run validate` | Format + Lint + TypeScript |

## Stranice

- `/` - Početna stranica
- `/usluge` - Pregled usluga

## Planirane funkcionalnosti

### User Dashboard

- Online zakazivanje termina sa prikazom slobodnih termina
- Opcija za dodatnu poruku pri zakazivanju
- Email podsetnici za termine

### Admin Dashboard

- Upravljanje blog postovima
- Pregled i upravljanje kartonima pacijenata
- Automatski email sistem na osnovu kartona pacijenta

## Konvencije

- Srpski jezik za UI tekst
- Module-based arhitektura
- `@/` path alias za importe
- `cn()` utility za Tailwind klase
