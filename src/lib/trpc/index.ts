import type { AppRouter } from '$lib/server/routes/_app';
import { createTRPCSvelte, httpBatchLink } from 'trpc-svelte-query';
import { transformer } from './transformer';

export const trpc = createTRPCSvelte<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc'
    })
  ],
  transformer
});
