# Kako raditi na projektu

## Početno podešavanje

1. **Kloniraj repo:**

   ```bash
   git clone git@github.com:HektorTech/dragana-stomatolog.git
   cd dragana-stomatolog
   ```

2. **Instaliraj dependencies:**

   ```bash
   npm install
   ```

3. **Podesi Next.js environment varijable:**

   ```bash
   cp .env.example .env.local
   ```

4. **Podesi Convex environment varijable:**

   Ove varijable se postavljaju direktno u Convex runtime (ne u `.env.local`):

   ```bash
   npx convex env set SITE_URL http://localhost:3000
   npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
   ```

   Da proveriš da li su postavljene:

   ```bash
   npx convex env list
   ```

5. **Pokreni Convex dev server:**

   ```bash
   npm run convex
   ```

   Ovo će te povezati sa deljenim dev deployment-om.

6. **Pokreni Next.js:**

   ```bash
   npm run dev
   ```

7. **Otvori u browseru:** http://localhost:3000

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

6. **Sačekaj review i merge**

### Konvencije za commit poruke

- `feat:` - nova funkcionalnost
- `fix:` - ispravka buga
- `refactor:` - refaktorisanje koda
- `docs:` - izmene dokumentacije
- `style:` - formatiranje, bez promene logike
- `chore:` - maintenance taskovi

## Convex Schema Izmene

Ako menjaš database schema (`convex/schema.ts`):

1. **Komuniciraj sa timom pre izmena** - da ne bi došlo do konflikta
2. **Testiraj lokalno** pre push-a
3. **Migracije se automatski primenjuju** pri deploy-u

### Šta se dešava pri push-u

- **PR ka main:** GitHub Action deployuje Convex funkcije na preview deployment i automatski postavlja env varijable
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
npm run lint          # Proveri lint greške
tsc --noEmit          # Type check bez emitovanja
npx convex env list   # Prikaži Convex env varijable
```

## Potrebna pomoć?

- Pogledaj CLAUDE.md za detaljne tehničke instrukcije
- Pitaj u timu ako nešto nije jasno

## Preview Deployments

Kada otvoriš PR, automatski se kreiraju:

1. **Convex preview deployment** - GitHub Action deployuje Convex funkcije
2. **Coolify preview** - frontend na `{{pr_number}}.dragana-stomatolog.hektor-tech.com`

Auth će raditi jer GitHub Action automatski postavlja `SITE_URL` na Coolify preview URL.
