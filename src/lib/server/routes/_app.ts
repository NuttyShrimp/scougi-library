import { router } from '../trpc';
import { scougiRouter } from './scougis';
import { usersRouter } from './users';

export const appRouter = router({
  scougi: scougiRouter,
  user: usersRouter,
});

export type AppRouter = typeof appRouter;
