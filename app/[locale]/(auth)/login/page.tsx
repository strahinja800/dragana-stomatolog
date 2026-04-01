import { Suspense } from 'react';

import { LoginForm } from '@/module/auth/components/login-form';

const Page = async () => {
  return (
    <Suspense
      fallback={
        <div className="w-full sm:max-w-md h-[500px] animate-pulse bg-muted rounded-lg" />
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default Page;
