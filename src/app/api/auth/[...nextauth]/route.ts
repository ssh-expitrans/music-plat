import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For now, a simple hardcoded user check
        if (
          credentials?.email === "teacher@example.com" &&
          credentials?.password === "password123"
        ) {
          return { id: "1", name: "Teacher", email: "teacher@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Error codes show on this page
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
