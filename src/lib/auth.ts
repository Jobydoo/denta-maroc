import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Identifiants Cabinet Dentaire',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'docteur@cabinet.ma' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Veuillez fournir un email et un mot de passe');
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && user.active) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
          }
        } catch (dbErr) {
          console.warn('Prisma DB non accessible en direct, vérification des comptes démo :', dbErr);
        }

        // Fallback Comptes Démonstration Maroc
        if (email === 'dr.alami@dentacare.ma' && password === 'Admin123!') {
          return { id: 'usr-admin-1', email, name: 'Dr. Mehdi Alami', role: 'ADMIN' };
        }
        if (email === 'assia@dentacare.ma' && password === 'Assistant123!') {
          return { id: 'usr-asst-2', email, name: 'Assia Benjelloun', role: 'ASSISTANT' };
        }
        if (email === 'labo.atlas@dentacare.ma' && password === 'Prothese123!') {
          return { id: 'usr-proth-3', email, name: 'Laboratoire Atlas Dental Casablanca', role: 'PROTHESISTE' };
        }

        throw new Error('Identifiants incorrects');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-denta-maroc-dev-2026',
};
