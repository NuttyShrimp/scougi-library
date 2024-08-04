import { db } from '$lib/server/db';
import { userTable } from '$lib/db/schema';
import { auth, dropboxAuth } from '$lib/server/lucia.js';
import type { RequestHandler } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
  if (locals.session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  }
  const storedState = cookies.get('dropbox_oauth_state');

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await dropboxAuth.validateAuthorizationCode(code);

    const response = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const user: DropboxUser = await response.json();

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.dropboxId, user.account_id)
    });

    let userId;

    if (!existingUser) {
      userId = generateId(15);
      await db.insert(userTable).values({
        id: userId,
        dropboxId: user.account_id,
        email: user.email,
        name: user.name.display_name,
        approved: false,
      });
    } else {
      userId = existingUser?.id;
    }

    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      console.log(e)
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    console.log(e);
    return new Response(null, {
      status: 500
    });
  }
};

interface DropboxUser {
  email: string;
  name: {
    given_name: string,
    surname: string,
    familiar_name: string,
    display_name: string,
  },
  account_id: string;
}
