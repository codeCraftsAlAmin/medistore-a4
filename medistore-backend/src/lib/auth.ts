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
      prompt: "select_account",
      accessType: "offline",
      clientId: config.google_credentials.client_id,
      clientSecret: config.google_credentials.client_secret,
    },
  },
});
