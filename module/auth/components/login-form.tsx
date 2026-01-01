'use client';

import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState } from 'nuqs';
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

const loginSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(1, 'Lozinka je obavezna'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [redirectUrl] = useQueryState('redirect');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success('Uspešna prijava!', {
            description: 'Dobrodošli nazad',
          });
          const destination = redirectUrl?.startsWith('/') ? redirectUrl : '/';
          router.push(destination);
        },
        onError: (ctx) => {
          toast.error('Pogrešna email adresa ili lozinka', {
            description: 'Pokušajte ponovno',
          });
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email adresa</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="vas@email.com"
                    autoComplete="email"
                    disabled={isPending}
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">Lozinka</FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="current-password"
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
