import type { ParamMatcher } from '@sveltejs/kit';
import z from 'zod';

export const match = ((param: string) => {
  const { success } = z.safeParse(z.number().min(1), Number(param));
  return success
}) satisfies ParamMatcher;
