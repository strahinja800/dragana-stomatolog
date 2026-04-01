import {
  authErrorCodes,
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

type TFn = (key: string) => string;

/**
 * Parsira Better Auth error response i vraća lokalizovanu poruku
 */
export function parseAuthError(ctx: AuthErrorContext, t: TFn): ParsedAuthError {
  const code = ctx.error?.code ?? null;
  const defaultMessage = t('auth.errors.default');

  const isKnownCode = code
    ? authErrorCodes.includes(code as (typeof authErrorCodes)[number])
    : false;
  const message = isKnownCode
    ? t(`auth.errors.${code}`)
    : (ctx.error?.message ?? defaultMessage);

  return {
    message,
    code,
    isEmailError: code ? EMAIL_RELATED_ERRORS.includes(code) : false,
    isPasswordError: code ? PASSWORD_RELATED_ERRORS.includes(code) : false,
  };
}
