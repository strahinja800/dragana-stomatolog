import 'dotenv/config';

import { auth } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

/**
 * Kreira jedan admin nalog na praznoj bazi.
 *
 * Nalog se pravi kroz Better Auth, a ne direktnim upisom u tabelu, jer se
 * lozinka čuva u Account tabeli u formatu koji Better Auth sam generiše.
 * Ručni insert bi napravio nalog koji ne može da se uloguje.
 *
 * Skripta učitava samo .env, ne i .env.local. Za pokretanje protiv
 * produkcijske baze prosledi DATABASE_URL i BETTER_AUTH_URL eksplicitno,
 * inače Better Auth ne može da odredi base URL.
 *
 * Pokretanje:
 *   DATABASE_URL=... BETTER_AUTH_URL=... \
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npm run seed:admin
 */
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Administrator';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL i ADMIN_PASSWORD moraju biti postavljeni');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD mora imati bar 8 karaktera');
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.role === 'admin') {
      console.log(
        `Nalog ${email} već postoji i već je admin, ništa nije promenjeno.`
      );
      return;
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });
    console.log(`Nalog ${email} je postojao, rola podignuta na admin.`);
    return;
  }

  await auth.api.signUpEmail({
    body: { email, password, name },
  });

  await prisma.user.update({
    where: { email },
    data: { role: 'admin', emailVerified: true },
  });

  console.log(`Admin nalog ${email} je kreiran.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
