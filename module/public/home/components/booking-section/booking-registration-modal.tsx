'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { Calendar, ChevronDown, Clock, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { signIn, signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { parseAuthError } from '@/module/auth/lib/auth-error-handler';
import {
  type BookingRegistrationInputs,
  createBookingRegistrationSchema,
  createLoginSchema,
  type LoginFormSchemaInputs,
} from '@/module/auth/types/auth-schema';

type ModalMode = 'register' | 'login';
type ModalStage = 'idle' | 'auth' | 'booking';

interface BookingDraft {
  date: Date;
  time: string;
  symptoms?: string;
}

interface PatientProfile {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE';
}

interface BookingRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: BookingDraft;
  onAuthenticatedBook: (
    draft: BookingDraft,
    profile?: PatientProfile
  ) => Promise<{ ok: boolean; error?: string }>;
}

export function BookingRegistrationModal({
  open,
  onOpenChange,
  draft,
  onAuthenticatedBook,
}: BookingRegistrationModalProps) {
  const t = useTranslations();
  const [mode, setMode] = useState<ModalMode>('register');
  const [stage, setStage] = useState<ModalStage>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [selectedGender, setSelectedGender] = useState<
    'MALE' | 'FEMALE' | undefined
  >();

  const isBusy = stage !== 'idle';

  const registerForm = useForm<BookingRegistrationInputs>({
    resolver: zodResolver(createBookingRegistrationSchema(t)),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const loginForm = useForm<LoginFormSchemaInputs>({
    resolver: zodResolver(createLoginSchema(t)),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const switchMode = (newMode: ModalMode) => {
    const currentEmail =
      mode === 'register'
        ? registerForm.getValues('email')
        : loginForm.getValues('email');

    setMode(newMode);
    setFormError(null);

    if (newMode === 'login' && currentEmail) {
      loginForm.setValue('email', currentEmail);
    } else if (newMode === 'register' && currentEmail) {
      registerForm.setValue('email', currentEmail);
    }
  };

  const handleRegister = async (values: BookingRegistrationInputs) => {
    setFormError(null);
    setStage('auth');

    await signUp.email(
      {
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
      },
      {
        onSuccess: async () => {
          setStage('booking');

          const profile: PatientProfile = {
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            dateOfBirth: values.dateOfBirth
              ? new Date(values.dateOfBirth)
              : undefined,
            gender: selectedGender,
          };

          const result = await onAuthenticatedBook(draft, profile);

          if (result.ok) {
            onOpenChange(false);
            resetState();
          } else {
            setStage('idle');
            setFormError(result.error ?? t('home.booking.authModal.slotTaken'));
          }
        },
        onError: (ctx) => {
          setStage('idle');
          const code = ctx.error?.code;

          if (
            code === 'USER_ALREADY_EXISTS' ||
            code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
          ) {
            switchMode('login');
            loginForm.setValue('email', values.email);
            setFormError(t('home.booking.authModal.emailExists'));
            return;
          }

          const error = parseAuthError(ctx, t);
          setFormError(error.message);
        },
      }
    );
  };

  const handleLogin = async (values: LoginFormSchemaInputs) => {
    setFormError(null);
    setStage('auth');

    await signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async () => {
          setStage('booking');
          const result = await onAuthenticatedBook(draft);

          if (result.ok) {
            onOpenChange(false);
            resetState();
          } else {
            setStage('idle');
            setFormError(result.error ?? t('home.booking.authModal.slotTaken'));
          }
        },
        onError: (ctx) => {
          setStage('idle');
          const error = parseAuthError(ctx, t);
          setFormError(error.message);
        },
      }
    );
  };

  const resetState = () => {
    setMode('register');
    setStage('idle');
    setFormError(null);
    setShowOptional(false);
    setSelectedGender(undefined);
    registerForm.reset();
    loginForm.reset();
  };

  const getButtonLabel = () => {
    if (stage === 'auth') {
      return mode === 'register'
        ? t('home.booking.authModal.creatingAccount')
        : t('home.booking.authModal.loggingIn');
    }
    if (stage === 'booking') {
      return t('home.booking.authModal.bookingAppointment');
    }
    return mode === 'register'
      ? t('home.booking.authModal.registerButton')
      : t('home.booking.authModal.loginButton');
  };

  return (
    <Dialog open={open} onOpenChange={isBusy ? undefined : onOpenChange}>
      <DialogContent className="max-h-[90svh] max-w-2xl overflow-hidden p-0">
        <div className="flex max-h-[90svh] flex-col">
          <DialogHeader className="sticky top-0 z-10 border-b bg-background/95 p-4 pb-3 backdrop-blur sm:p-6 sm:pb-4">
            <DialogTitle>
              {mode === 'register'
                ? t('home.booking.authModal.registerTitle')
                : t('home.booking.authModal.loginTitle')}
            </DialogTitle>
            <DialogDescription>
              {mode === 'register'
                ? t('home.booking.authModal.registerSubtitle')
                : t('home.booking.authModal.loginSubtitle')}
            </DialogDescription>

            <div className="mt-2 flex items-center gap-4 rounded-xl border bg-muted/40 px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" />
                {format(draft.date, 'EEEE, d. MMMM', { locale: sr })}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                {draft.time}
              </span>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {formError && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            {mode === 'register' ? (
              <form
                id="register-form"
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-firstName">
                      {t('home.booking.authModal.firstName')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-firstName"
                      autoComplete="given-name"
                      autoFocus
                      disabled={isBusy}
                      {...registerForm.register('firstName')}
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {registerForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-lastName">
                      {t('home.booking.authModal.lastName')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-lastName"
                      autoComplete="family-name"
                      disabled={isBusy}
                      {...registerForm.register('lastName')}
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {registerForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">
                      {t('home.booking.authModal.email')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      disabled={isBusy}
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-destructive">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-phone">
                      {t('home.booking.authModal.phone')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      disabled={isBusy}
                      {...registerForm.register('phone')}
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-xs text-destructive">
                        {registerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password">
                      {t('home.booking.authModal.password')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={isBusy}
                        className="pr-10"
                        {...registerForm.register('password')}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.password ? (
                      <p className="text-xs text-destructive">
                        {registerForm.formState.errors.password.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t('home.booking.authModal.passwordHelper')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-confirmPassword">
                      {t('home.booking.authModal.confirmPassword')}{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={isBusy}
                        className="pr-10"
                        {...registerForm.register('confirmPassword')}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 p-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground"
                    aria-expanded={showOptional}
                    onClick={() => setShowOptional((v) => !v)}
                  >
                    {t('home.booking.authModal.optionalSection')}
                    <ChevronDown
                      className={cn(
                        'size-4 transition-transform',
                        showOptional && 'rotate-180'
                      )}
                    />
                  </button>

                  {showOptional && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-dateOfBirth">
                          {t('home.booking.authModal.dateOfBirth')}
                        </Label>
                        <Input
                          id="reg-dateOfBirth"
                          type="date"
                          autoComplete="bday"
                          disabled={isBusy}
                          {...registerForm.register('dateOfBirth')}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="reg-gender">
                          {t('home.booking.authModal.gender')}
                        </Label>
                        <Select
                          value={selectedGender}
                          onValueChange={(v) =>
                            setSelectedGender(v as 'MALE' | 'FEMALE')
                          }
                          disabled={isBusy}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'home.booking.authModal.selectGender'
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">
                              {t('home.booking.authModal.male')}
                            </SelectItem>
                            <SelectItem value="FEMALE">
                              {t('home.booking.authModal.female')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <form
                id="login-form"
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">
                    {t('home.booking.authModal.email')}
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    disabled={isBusy}
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-password">
                    {t('home.booking.authModal.password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      disabled={isBusy}
                      className="pr-10"
                      {...loginForm.register('password')}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="sticky bottom-0 z-10 border-t bg-background/95 p-4 backdrop-blur sm:p-6">
            {stage !== 'idle' && (
              <p
                aria-live="polite"
                className="mb-2 text-center text-sm text-muted-foreground"
              >
                {stage === 'auth' &&
                  (mode === 'register'
                    ? t('home.booking.authModal.creatingAccount')
                    : t('home.booking.authModal.loggingIn'))}
                {stage === 'booking' &&
                  t('home.booking.authModal.bookingAppointment')}
              </p>
            )}

            <Button
              type="submit"
              form={mode === 'register' ? 'register-form' : 'login-form'}
              className="w-full"
              disabled={isBusy}
            >
              {getButtonLabel()}
            </Button>

            <p className="mt-3 text-center text-sm text-muted-foreground">
              {mode === 'register'
                ? t('home.booking.authModal.hasAccount')
                : t('home.booking.authModal.noAccount')}{' '}
              <button
                type="button"
                disabled={isBusy}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                onClick={() =>
                  switchMode(mode === 'register' ? 'login' : 'register')
                }
              >
                {mode === 'register'
                  ? t('home.booking.authModal.switchToLogin')
                  : t('home.booking.authModal.switchToRegister')}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
