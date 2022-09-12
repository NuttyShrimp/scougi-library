import NextAuth, { NextAuthOptions } from "next-auth";
import DropBoxProvider from 'next-auth/providers/dropbox';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'database',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.approved = user.approved
      }
      return session;
    },
  },
  providers: [
    DropBoxProvider({
      clientId: process.env.DROPBOX_CLIENT_ID,
      clientSecret: process.env.DROPBOX_CLIENT_SECRET
    }),
  ],
  adapter: PrismaAdapter(prisma)
}

export default NextAuth(authOptions)
