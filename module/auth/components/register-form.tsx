'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';

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
import { parseAuthError } from '@/lib/auth-error-handler';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
    email: z.string().email('Unesite validnu email adresu'),
    password: z.string().min(8, 'Lozinka mora imati najmanje 8 karaktera'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<{
    message: string;
    isEmailError: boolean;
  } | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);

    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: (response) => {
          toast.success('Uspešna registracija!', {
            description: `Dobrodošli, ${response.data.user.name}`,
          });
          router.push('/');
        },
        onError: (ctx) => {
          console.log('Register error', ctx);
          const error = parseAuthError(ctx);

          setServerError({
            message: error.message,
            isEmailError: error.isEmailError,
          });

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
        <CardTitle>Registrujte se</CardTitle>
        <CardDescription>
          Kreirajte nalog za pristup svim funkcijama
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

        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-name">Ime i prezime</FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Marko Marković"
                    autoComplete="name"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => {
                const hasError =
                  fieldState.invalid || serverError?.isEmailError;
                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor="register-email">
                      Email adresa
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-email"
                      type="email"
                      aria-invalid={hasError}
                      placeholder="vas@email.com"
                      autoComplete="email"
                      disabled={isPending}
                      onChange={(e) => {
                        field.onChange(e);
                        if (serverError?.isEmailError) {
                          setServerError(null);
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    {!fieldState.invalid && serverError?.isEmailError && (
                      <FieldError errors={[{ message: serverError.message }]} />
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Lozinka</FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="new-password"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-confirm-password">
                    Potvrdite lozinku
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-confirm-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="new-password"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
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
          form="register-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Registracija...' : 'Registruj se'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Već imate nalog?{' '}
          <Link
            href="/login"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Prijavite se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
