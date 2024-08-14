import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

Sentry.init({
    dsn: "https://faa116af059a4d918c5a23f2b04c1305@glitchtip.lecoutere.dev/2",
    tracesSampleRate: 1
})

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
  const sessionId = event.cookies.get(auth.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSession(sessionId);
  if (session?.fresh) {
    const sessionCookie = auth.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  if (!session) {
    const sessionCookie = auth.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
});

export const handleError = Sentry.handleErrorWithSentry();