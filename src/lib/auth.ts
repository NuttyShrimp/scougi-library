import { Lucia } from "lucia";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";
import { cache } from "react";
import { Dropbox } from "arctic";

import type { User as DbUser } from '@/lib/db/schema';
import type { Session, User } from "lucia";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})

const adapter = new LibSQLAdapter(db, {
  user: "user",
  session: "session"
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      approved: attributes.approved,
      email: attributes.email,
      name: attributes.name,
      dropboxId: attributes.dropboxId,
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DbUser, "id">;
  }
}

export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch { }
    return result;
  }
);

export const dropbox = new Dropbox(process.env.DROPBOX_CLIENT_ID!, process.env.DROPBOX_CLIENT_SECRET!, process.env.DROPBOX_REDIRECT!)

