import { dev } from '$app/environment';
import { dropboxAuth } from '$lib/server/lucia';
import type { RequestHandler } from '@sveltejs/kit';
import { generateState } from 'arctic';

export const GET: RequestHandler = async ({ cookies, locals }) => {
  if (locals.session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  }

  const state = generateState();

  const url = await dropboxAuth.createAuthorizationURL(state, {
    scopes: ["email", "profile", "account_info.read"]
  });
  cookies.set('dropbox_oauth_state', state, {
    httpOnly: true,
    secure: !dev,
    path: '/',
    maxAge: 60 * 60
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString()
    }
  });
};
