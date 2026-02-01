import { env } from "@/types/env";
import { cookies } from "next/headers";

// get session from server compo
const NEXT_PUBLIC_BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      // console.log(cookieStore.toString());

      const res = await fetch(
        `${NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
          cache: "no-cache",
        },
      );

      const session = await res.json();

      if (session === null) {
        return { data: null, error: { message: "Session is missing" } };
      }

      return { data: session, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};
