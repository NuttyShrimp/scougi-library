import type { AppRouter } from '$lib/server/routes/_app';
import { createTRPCSvelte, httpLink } from 'trpc-svelte-query';
import { transformer } from './transformer';

export const trpc = createTRPCSvelte<AppRouter>({
  links: [
    httpLink({
      url: '/api/trpc'
    })
  ],
  transformer
});
