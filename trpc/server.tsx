import { cache, Suspense } from 'react';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from '@trpc/tanstack-react-query';

import { LoadingFallback } from '@/components/shared/loading-fallback';

import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

import 'server-only';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const trpcCaller = appRouter.createCaller(createTRPCContext);

export function HydrateClient(props: {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={props.loadingFallback || <LoadingFallback />}>
        {props.children}
      </Suspense>
    </HydrationBoundary>
  );
}
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
