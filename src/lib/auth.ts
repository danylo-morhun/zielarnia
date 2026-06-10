import type { NextAuthConfig } from "next-auth";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: "CUSTOMER" | "ADMIN";
    };
  }
  interface User {
    role?: "CUSTOMER" | "ADMIN";
  }
}

const config: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/logowanie",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      const role = token.role;
      if (role === "CUSTOMER" || role === "ADMIN") {
        session.user.role = role;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
