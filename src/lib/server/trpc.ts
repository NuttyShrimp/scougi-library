import { transformer } from '$lib/trpc/transformer';
import type { RequestEvent } from '@sveltejs/kit';
import { TRPCError, type inferAsyncReturnType, initTRPC } from '@trpc/server';
import { } from '@trpc/server';
import type { Session, User } from 'lucia';

export const createContext = async ({
  locals
}: RequestEvent): Promise<{ session: Session | null; user: User | null }> => {
  return {
    session: locals.session,
    user: locals.user
  };
};

const t = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create({
  transformer
});

export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserAuthentication = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user
    }
  });
});

export const protectedProcedure = publicProcedure.use(enforceUserAuthentication);
