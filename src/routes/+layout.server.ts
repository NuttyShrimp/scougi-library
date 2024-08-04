import { trpcServer } from '$lib/server/';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  return {
    trpc: await trpcServer.hydrateToClient(event)
  };
};
