'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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
import { logoNegativ } from '@/data/data';
import { authClient } from '@/lib/auth-client';
import { parseAuthError } from '@/module/auth/lib/auth-error-handler';
import {
  type RegisterFormSchemaInputs,
  registerSchema,
} from '@/module/auth/types/auth-schema';
import { useTRPC } from '@/trpc/client';

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<{
    message: string;
    isEmailError: boolean;
  } | null>(null);

  const form = useForm<RegisterFormSchemaInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  const trpc = useTRPC();
  const { mutateAsync: createPatient } = useMutation(
    trpc.patient.createForSelf.mutationOptions()
  );

  const onSubmit = async (data: RegisterFormSchemaInputs) => {
    setServerError(null);

    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      },
      {
        onSuccess: async (response) => {
          toast.success('Uspešna registracija!', {
            description: `Dobrodošli, ${response.data.user.name}`,
          });

          try {
            await createPatient({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              userId: response.data.user.id,
            });
            router.push('/');
          } catch (error) {
            console.error('Error creating patient:', error);
          }
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

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4 inline-flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-soft">
            <Image
              src={logoNegativ}
              alt="DENTALHOLIST KONCEPT"
              height={36}
              className="h-9 w-auto"
            />
          </div>
          <span className="text-foreground font-semibold text-xl">
            DENTALHOLIST
          </span>
        </Link>
        <CardTitle>Registrujte se</CardTitle>
        <CardDescription>
          Kreirajte nalog za pristup svim funkcijama
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-firstName">Ime</FieldLabel>
                  <Input
                    {...field}
                    id="register-firstName"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Marko"
                    autoComplete="given-name"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-lastName">Prezime</FieldLabel>
                  <Input
                    {...field}
                    id="register-lastName"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Marković"
                    autoComplete="family-name"
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
