import {
  authMessagesSr,
  EMAIL_RELATED_ERRORS,
  PASSWORD_RELATED_ERRORS,
} from './auth-messages';

interface AuthErrorContext {
  error: {
    code?: string;
    message?: string;
  };
}

interface ParsedAuthError {
  message: string;
  code: string | null;
  isEmailError: boolean;
  isPasswordError: boolean;
}

const DEFAULT_ERROR_MESSAGE = 'Došlo je do greške, pokušajte ponovo';

/**
 * Parsira Better Auth error response i vraća lokalizovanu poruku
 */
export function parseAuthError(ctx: AuthErrorContext): ParsedAuthError {
  const code = ctx.error?.code ?? null;
  const message = code
    ? (authMessagesSr[code] ?? ctx.error?.message ?? DEFAULT_ERROR_MESSAGE)
    : (ctx.error?.message ?? DEFAULT_ERROR_MESSAGE);

  return {
    message,
    code,
    isEmailError: code ? EMAIL_RELATED_ERRORS.includes(code) : false,
    isPasswordError: code ? PASSWORD_RELATED_ERRORS.includes(code) : false,
  };
}

/**
 * Vraća lokalizovanu poruku za dati error kod
 */
export function getAuthErrorMessage(code: string): string {
  return authMessagesSr[code] ?? DEFAULT_ERROR_MESSAGE;
}
