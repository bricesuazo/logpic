import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { prisma } from "../server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      image: string | null;
      role: "HR" | "EMPLOYEE";

      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image: string | null;
    role: "HR" | "EMPLOYEE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image: string | null;
    role: "HR" | "EMPLOYEE";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },

    // jwt({ token, user }) {
    //   console.log("🚀 ~ file: auth.ts:63 ~ jwt ~ user", user);
    //   console.log("🚀 ~ file: auth.ts:63 ~ jwt ~ token", token);
    //   if (user) {
    //     token.id = user.id;
    //     token.first_name = user.first_name;
    //     token.last_name = user.last_name;
    //     token.email = user.email;
    //     token.image = user.image;
    //     token.role = user.role;
    //   }
    //   return token;
    // },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        type: {
          label: "Type",
          type: "text",
          placeholder: "HR / EMPLOYEE",
        },
        id: { label: "", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.type ||
          !credentials.id ||
          !credentials.password
        ) {
          throw new Error("Invalid credentials");
        }
        if (credentials.type !== "HR" && credentials.type !== "EMPLOYEE") {
          throw new Error("Invalid type");
        }

        if (credentials.type === "HR") {
          const hr = await prisma.hR.findUnique({
            where: { id: credentials.id },
          });
          if (!hr) {
            throw new Error("No user found");
          }

          if (!(await bcrypt.compare(credentials.password, hr.password))) {
            throw new Error("Invalid password");
          }

          const { password, createdAt, updatedAt, ...rest } = hr;

          return { ...rest, role: "HR" };
        } else if (credentials.type === "EMPLOYEE") {
          const employee = await prisma.employee.findUnique({
            where: { id: credentials.id },
          });
          if (!employee) {
            throw new Error("No user found");
          }
          if (
            !(await bcrypt.compare(credentials.password, employee.password))
          ) {
            throw new Error("Invalid password");
          }
          const { password, createdAt, updatedAt, ...rest } = employee;

          return { ...rest, role: "EMPLOYEE" };
        } else {
          throw new Error("Invalid type");
        }
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
