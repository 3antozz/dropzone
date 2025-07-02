import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prismaClient";
import { signInSchema } from "@/lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = await signInSchema.safeParseAsync(credentials);
        if(!validatedFields.success) {
            return null;
        }
        const {email, password} = validatedFields.data;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            throw new Error("Invalid credentials.")
        }
        const checkPW = await compare(password, user.password)
        if(!checkPW) {
            throw new Error("Invalid credentials.")
        }
        if (user.twoFactorEnabled) {
          // Temporarily mark session as "2fa_pending"
          return { id: user.id, email, twoFA: user.twoFactorEnabled, twoFactorPending: true };
        }
        return {
          id: user.id,
          email,
          twoFA: false
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) { // User is available during sign-in
        token.id = user.id;
        token.twoFA = user.twoFA;
        token.twoFactorPending = user.twoFactorPending;
      }
      if(trigger === "update") {
        const dbUser = await prisma.user.findUnique({
            where: {
                id: Number(token?.id)
            }
        })
        if(dbUser) {
          token.twoFA = dbUser.twoFactorEnabled;
          token.twoFactorPending = false;
        }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.twoFA = token.twoFA;
      session.user.twoFactorPending = token.twoFactorPending;
      return session
    },
  },
  pages: {
    signIn: '/login'
  },
  trustHost: true
})