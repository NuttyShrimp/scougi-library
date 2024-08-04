import { dev } from '$app/environment';
import {
  DROPBOX_REDIRECT,
  DROPBOX_CLIENT_ID,
  DROPBOX_CLIENT_SECRET,
} from '$env/static/private';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { Dropbox } from 'arctic';
import { Lucia } from 'lucia';
import { db } from './db';
import { sessionTable, userTable, type User } from '../db/schema';

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (data) => {
    return {
      email: data.email,
      name: data.name,
      approved: data.approved
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: Omit<User, 'id'>;
  }
}

export const dropboxAuth = new Dropbox(DROPBOX_CLIENT_ID, DROPBOX_CLIENT_SECRET, DROPBOX_REDIRECT);

export type Auth = typeof auth;
