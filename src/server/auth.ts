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

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//     image: string;
//     role: "HR" | "EMPLOYEE";
//   }
// }

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.first_name = user.first_name;
        session.user.last_name = user.last_name;
        session.user.email = user.email;
        session.user.image = user.image;
        session.user.role = user.role;

        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        type: {
          label: "Type",
          type: "text",
          placeholder: "HR / EMPLOYEE",
          value: "HR" || "EMPLOYEE",
        },
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials?.type ||
          !credentials?.username ||
          !credentials?.password
        ) {
          throw new Error("Invalid credentials");
        }
        if (credentials.type !== "HR" && credentials.type !== "EMPLOYEE") {
          throw new Error("Invalid type");
        }

        if (credentials.type === "HR") {
          const hr = await prisma.hR.findUnique({
            where: { email: credentials.username },
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
            where: { id: credentials.username },
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
