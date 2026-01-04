/**
 * Srpski prevodi za Better Auth error poruke
 */
export const authMessagesSr: Record<string, string> = {
  // Korisnik
  USER_NOT_FOUND: 'Korisnik nije pronađen',
  USER_ALREADY_EXISTS: 'Korisnik sa ovim emailom već postoji',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Korisnik sa ovim emailom već postoji',

  // Autentifikacija
  INVALID_PASSWORD: 'Pogrešna lozinka',
  INVALID_EMAIL: 'Nevalidna email adresa',
  INVALID_EMAIL_OR_PASSWORD: 'Pogrešna email adresa ili lozinka',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Nalog sa ovim kredencijalima nije pronađen',
  INVALID_CREDENTIALS: 'Pogrešna email adresa ili lozinka',

  // Sesija
  SESSION_EXPIRED: 'Sesija je istekla, prijavite se ponovo',
  SESSION_NOT_FOUND: 'Sesija nije pronađena',

  // Rate limiting
  TOO_MANY_ATTEMPTS: 'Previše pokušaja, pokušajte kasnije',

  // Token
  INVALID_TOKEN: 'Nevažeći token',
  TOKEN_EXPIRED: 'Token je istekao',

  // Email verifikacija
  EMAIL_NOT_VERIFIED: 'Email adresa nije verifikovana',
  EMAIL_ALREADY_VERIFIED: 'Email adresa je već verifikovana',

  // Ostalo
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Ovaj nalog je već povezan',
  ACCOUNT_NOT_LINKED: 'Nalog nije povezan',
};

/**
 * Error kodovi vezani za email polje
 * Koristi se za inline prikaz errora ispod email inputa
 */
export const EMAIL_RELATED_ERRORS = [
  'USER_ALREADY_EXISTS',
  'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
  'USER_NOT_FOUND',
  'INVALID_EMAIL',
  'EMAIL_NOT_VERIFIED',
  'CREDENTIAL_ACCOUNT_NOT_FOUND',
];

/**
 * Error kodovi vezani za password polje
 */
export const PASSWORD_RELATED_ERRORS = ['INVALID_PASSWORD'];
