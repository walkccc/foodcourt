import { PrismaAdapter } from '@auth/prisma-adapter';
import type { User } from '@prisma/client';
import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { db } from '@/lib/db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUser(token.sub);
      if (!existingUser) return token;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});

async function getUser(id: User['id']): Promise<User | null> {
  return await db.user.findUnique({ where: { id } });
}
