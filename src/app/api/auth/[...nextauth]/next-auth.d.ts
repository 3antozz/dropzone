// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: number,
    twoFA?: boolean;
    twoFactorPending?: boolean;
  }
  interface Session {
    user: {
      id: number,
      twoFA?: boolean,
      twoFactorPending: boolean;
    } & DefaultSession["user"]
  }
}