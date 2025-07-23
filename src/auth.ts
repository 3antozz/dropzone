import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prismaClient";
import { signInSchema } from "@/lib/zod";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        flag: {},
        twoFA: {}
      },
      authorize: async (credentials) => {
        if (credentials.flag === "2fa-complete" && credentials.twoFA) { // handle 2fa logins first
            // This is a 2FA-complete login, allow it
            const user = await prisma.user.findUnique({ where: { email: String(credentials.email) } });
            if (!user) return null;
            return { id: user.id, email: user.email, twoFA: true };
        }
        const validatedFields = await signInSchema.safeParseAsync(credentials);
        if(!validatedFields.success) {
            throw new Error("Invalid credentials.")
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
        const cookieStore = await cookies()
        if (user.twoFactorEnabled) {
            // Set a short-lived, httpOnly cookie with userId to get userid when verifying OTP
            cookieStore.set("2fa_user", String(user.id), { httpOnly: true, maxAge: 300, path: "/" });
            throw new Error('2FA_REQUIRED');
        }
        cookieStore.delete("2fa_user");
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
      }
      if(trigger === "update") {
        const dbUser = await prisma.user.findUnique({
            where: {
                id: Number(token?.id)
            }
        })
        if(dbUser) {
          token.twoFA = dbUser.twoFactorEnabled;
        }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.twoFA = token.twoFA;
      return session
    },
  },
  pages: {
    signIn: '/login'
  },
  trustHost: true
})