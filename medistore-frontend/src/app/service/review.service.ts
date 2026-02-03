import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const reviewService = {
  createReview: async (
    medicineId: string,
    payload: { rating: number; comment: string },
  ) => {
    const cookieStore = await cookies();
    const res = await fetch(`${BACKEND_URL}/api/review/${medicineId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  
  getMyReviews: async () => {
    const cookieStore = await cookies();
    const res = await fetch(`${BACKEND_URL}/api/review`, {
      headers: { Cookie: cookieStore.toString() },
      next: { tags: ["reviews"] },
    });
    return res.json();
  },

  deleteReview: async (reviewId: string) => {
    const cookieStore = await cookies();
    const res = await fetch(`${BACKEND_URL}/api/review/${reviewId}`, {
      method: "DELETE",
      headers: { Cookie: cookieStore.toString() },
    });
    return res.json();
  },
};
