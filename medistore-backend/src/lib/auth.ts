import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import { sendEmail } from "./sendEmail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // additional fields
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "CUSTOMER", "SELLER"],
        required: false,
        defaultValue: "CUSTOMER",
      },
      status: {
        type: ["BAN", "UNBAN"],
        required: false,
        defaultValue: "UNBAN",
      },
    },
  },
  trustedOrigins: [config.urls.frontend_url],
  // # email and password verification
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true, // send email wihile signing up
    verifyEmailRedirectPath: "/login?verified=true",
    sendVerificationEmail: async ({ user, url }) => {
      sendEmail({ user, url });
    },
  },
  // # gmail verification
  socialProviders: {
    google: {
      prompt: "select_account",
      accessType: "offline",
      clientId: config.google_credentials.client_id,
      clientSecret: config.google_credentials.client_secret,
    },
  },
});
