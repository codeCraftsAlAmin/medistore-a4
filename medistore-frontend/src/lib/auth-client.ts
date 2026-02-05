import { createAuthClient } from "better-auth/react";
import { env } from "@/types/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_FRONTEND_URL,
  fetchOptions: {
    credentials: "include",
  },
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
});
