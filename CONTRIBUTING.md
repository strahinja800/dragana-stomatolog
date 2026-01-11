# Kako raditi na projektu

## Pocetno podesavanje

1. **Kloniraj repo:**

   ```bash
   git clone git@github.com:HektorTech/dragana-stomatolog.git
   cd dragana-stomatolog
   ```

2. **Instaliraj dependencies:**

   ```bash
   npm install
   ```

3. **Podesi environment varijable:**

   ```bash
   cp .env.example .env.local
   ```

   Zatim popuni `.env.local` sa pravim vrednostima:
   - `BETTER_AUTH_SECRET` - generisi sa `openssl rand -base64 32`
   - `DATABASE_URL` - dobices od team lead-a ili iz Neon dashboard-a

4. **Pokreni Convex dev server:**

   ```bash
   npm run convex
   ```

   Ovo ce te povezati sa deljenim dev deploymentom.

5. **Pokreni Next.js:**

   ```bash
   npm run dev
   ```

6. **Otvori u browseru:** http://localhost:3000

## Git Workflow

### Kreiranje nove funkcionalnosti

1. **Napravi novu granu od main:**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/ime-funkcionalnosti
   ```

2. **Radi izmene i testiraj lokalno**

3. **Commit sa jasnom porukom:**

   ```bash
   git add .
   git commit -m "feat: opis izmene"
   ```

4. **Push na remote:**

   ```bash
   git push -u origin feat/ime-funkcionalnosti
   ```

5. **Otvori Pull Request na GitHub-u**

6. **Sacekaj review i merge**

### Konvencije za commit poruke

- `feat:` - nova funkcionalnost
- `fix:` - ispravka buga
- `refactor:` - refaktorisanje koda
- `docs:` - izmene dokumentacije
- `style:` - formatiranje, bez promene logike
- `chore:` - maintenance taskovi

## Convex Schema Izmene

Ako menjas database schema (`convex/schema.ts`):

1. **Komuniciraj sa timom pre izmena** - da ne bi doslo do konflikta
2. **Testiraj lokalno** pre push-a
3. **Migracije se automatski primenjuju** pri deploy-u

### Sta se desava pri push-u

- **PR ka main:** GitHub Action deployuje Convex funkcije na preview deployment
- **Merge u main:** GitHub Action deployuje na production

## Struktura projekta

```
app/                  # Next.js App Router stranice
convex/               # Convex backend (schema, queries, mutations)
module/               # Feature moduli (komponente po domenima)
components/ui/        # shadcn/ui komponente
lib/                  # Utility funkcije
```

## Korisne komande

```bash
npm run dev           # Pokreni Next.js dev server
npm run convex        # Pokreni Convex dev server
npm run build         # Build za produkciju
npm run lint          # Proveri lint greske
tsc --noEmit          # Type check bez emitovanja
```

## Potrebna pomoc?

- Pogledaj CLAUDE.md za detaljne tehnicke instrukcije
- Pitaj u timu ako nesto nije jasno
