import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import { sendEmail } from "./sendEmail";

export const auth = betterAuth({
  baseURL: config.auth.better_auth_url,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ? update trusted origin
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");

    const allowedOrigins = [
      config.urls.frontend_url,
      config.auth.better_auth_url,
      "http://localhost:3000",
      "http://localhost:5000",
    ].filter(Boolean);

    // check if origin matches allowed origins or Vercel pattern
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }

    return [];
  },

  basePath: "/api/auth",
  // ? additional fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "UNBAN",
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 mins
    },
  },

  // ? update advance configue
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true,
  },
  // # email and password verification
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        user,
        url,
        subject: "Reset your password",
        title: "Password reset request",
        buttonText: "Reset Password",
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        user,
        url,
        subject: "Verify your account",
        title: "Welcome to mediStore",
        buttonText: "Verify Email",
      });
    },
  },
  // # gmail verification
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: config.google_credentials.client_id,
      clientSecret: config.google_credentials.client_secret,
    },
  },
});
