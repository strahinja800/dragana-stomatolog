'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { parseAuthError } from '@/module/auth/lib/auth-error-handler';
import {
  type LoginFormSchemaInputs,
  loginSchema,
} from '@/module/auth/types/auth-schema';

export function LoginForm() {
  const router = useRouter();
  const [redirectUrl] = useQueryState('redirect');
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormSchemaInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: LoginFormSchemaInputs) => {
    setServerError(null);

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async () => {
          toast.success('Uspešna prijava!', {
            description: 'Dobrodošli nazad',
          });

          // Ako postoji redirect URL, koristi ga
          if (redirectUrl?.startsWith('/')) {
            router.push(redirectUrl);
            return;
          }

          // Inače, redirektuj na osnovu uloge
          const session = await authClient.getSession();
          const role = session.data?.user?.role;
          const destination = role === 'admin' ? '/admin' : '/profile';
          router.push(destination);
        },
        onError: (ctx) => {
          const error = parseAuthError(ctx);
          setServerError(error.message);
          toast.error(error.message);
        },
      }
    );
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    toast.info('Google login', {
      description: 'Google login će biti dostupan uskoro',
    });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4 inline-flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-soft">
            <Image
              src={logo}
              alt="DentalCare"
              height={36}
              className="h-9 w-auto"
            />
          </div>
          <span className="text-foreground font-semibold text-xl">
            DentalCare
          </span>
        </Link>
        <CardTitle>Prijavite se</CardTitle>
        <CardDescription>
          Unesite svoje podatke za pristup nalogu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isPending}
        >
          <Image src="/logos/google.svg" width={20} height={20} alt="Google" />
          Nastavi sa Google nalogom
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ili</span>
          </div>
        </div>

        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || !!serverError}>
                  <FieldLabel htmlFor="login-email">Email adresa</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    aria-invalid={fieldState.invalid || !!serverError}
                    placeholder="vas@email.com"
                    autoComplete="email"
                    disabled={isPending}
                    onChange={(e) => {
                      field.onChange(e);
                      if (serverError) {
                        setServerError(null);
                      }
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || !!serverError}>
                  <FieldLabel htmlFor="login-password">Lozinka</FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    type="password"
                    aria-invalid={fieldState.invalid || !!serverError}
                    placeholder="********"
                    autoComplete="current-password"
                    disabled={isPending}
                    onChange={(e) => {
                      field.onChange(e);
                      if (serverError) {
                        setServerError(null);
                      }
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {!fieldState.invalid && serverError && (
                    <FieldError errors={[{ message: serverError }]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Prijavljivanje...' : 'Prijavi se'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Nemate nalog?{' '}
          <Link
            href="/register"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Registrujte se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
