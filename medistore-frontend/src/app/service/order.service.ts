import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const orderService = {
  getOrders: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/order/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const response = await res.json();
      return res.ok
        ? { data: response.data, error: null }
        : { data: null, error: response };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Failed to fetch orders" },
      };
    }
  },

  updateOrderStatus: async function (orderId: string, status: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${BACKEND_URL}/api/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
      });

      const response = await res.json();
      return res.ok
        ? { data: response.data, error: null }
        : { data: null, error: response };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || "Update failed" },
      };
    }
  },
};
