import { env } from "@/types/env";
import { cookies } from "next/headers";

// get session from server compo
const NEXT_PUBLIC_BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();

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
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  getAllUsers: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/users/`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const response = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: response.message || "Failed to fetch users" },
        };
      }

      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something went wrong" } };
    }
  },

  updateUserStatus: async function (userId: string, status: "BAN" | "UNBAN") {
    try {
      const cookieStore = await cookies();
      const res = await fetch(
        `${NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
          },
          body: JSON.stringify({ status }),
        },
      );

      const response = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: response.message || "Failed to update user status",
        };
      }

      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
};
