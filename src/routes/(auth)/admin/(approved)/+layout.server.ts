import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) return redirect(301, "/login/dropbox");
  if (!locals.user?.approved) return redirect(301, '/admin/approval-pending');
  return {};
};
