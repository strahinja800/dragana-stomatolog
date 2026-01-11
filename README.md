# DentalCare - Stomatološka ordinacija

Moderni website za stomatološku ordinaciju izrađen u Next.js 16 sa React 19 i Tailwind CSS 4.

## Tech Stack

### Frontend

- **Next.js 16** - App Router, React Server Components
- **React 19** - Najnovija verzija React-a
- **TypeScript 5** - Striktna tipizacija
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Radix-based komponente
- **react-hook-form** - Upravljanje formama

### Backend

- **Convex** - Serverless backend sa real-time sync
- **Better Auth** - Autentifikacija sa Convex adapterom

### Hosting

- **Coolify** - Self-hosted PaaS on VPS

## Pokretanje

```bash
# Instalacija
npm install

# Development server
npm run dev

# Convex dev server (u posebnom terminalu)
npm run convex

# Production build
npm run build
```

## Struktura projekta

```text
app/                    # Next.js App Router
  (public)/             # Javne stranice
  (admin)/              # Admin panel
convex/                 # Convex backend
  schema.ts             # Database schema
  appointments.ts       # Termini
  settings.ts           # Podešavanja
  auth.ts               # Autentifikacija
module/                 # Feature moduli
  public/               # Javne komponente
  admin/                # Admin komponente
  auth/                 # Auth komponente
components/ui/          # shadcn komponente
constants/              # Navigacija, admin nav
assets/                 # Slike
```

## Dostupne komande

| Komanda            | Opis                       |
| ------------------ | -------------------------- |
| `npm run dev`      | Development server         |
| `npm run convex`   | Convex dev server          |
| `npm run build`    | Production build           |
| `npm run lint`     | ESLint provera             |
| `npm run validate` | Format + Lint + TypeScript |

## Stranice

### Javne

- `/` - Početna stranica
- `/usluge` - Pregled usluga

### Admin

- `/admin` - Kontrolna tabla
- `/admin/termini` - Upravljanje terminima
- `/admin/patients` - Pacijenti
- `/admin/podesavanja` - Podešavanja klinike
- `/admin/blog` - Blog (u izradi)

## Funkcionalnosti

### Implementirano

- Online zakazivanje termina sa prikazom slobodnih termina
- Admin panel za upravljanje terminima (potvrda, odbijanje, pomeranje)
- Podešavanje radnog vremena i neradnih dana
- Upravljanje vrstama usluga

### Planirano

- Email podsetnici za termine
- Upravljanje blog postovima
- Pregled i upravljanje kartonima pacijenata

## Konvencije

- Srpski jezik za UI tekst
- Module-based arhitektura
- `@/` path alias za importe
- `cn()` utility za Tailwind klase
