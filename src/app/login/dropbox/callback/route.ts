import { dropbox, lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";
import { userTable } from "@/lib/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("dropbox_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await dropbox.validateAuthorizationCode(code);

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

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin"
        }
      });
    }

    const userId = generateId(15);
    await db.insert(userTable).values({
      id: userId,
      dropboxId: user.account_id,
      email: user.email,
      name: user.name.display_name,
      approved: false
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin"
      }
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    console.error(e);
    return new Response(null, {
      status: 500
    });
  }
}

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
