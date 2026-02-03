"use server";

import { reviewService } from "@/app/service/review.service";
import { revalidatePath } from "next/cache";

export async function handleCreateReview(
  medicineId: string,
  payload: { rating: number; comment: string },
) {
  try {
    const result = await reviewService.createReview(medicineId, payload);

    if (result.success) {
      // Revalidate paths to show updated data
      revalidatePath("/customer/orders");
      revalidatePath("/customer/reviews");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}
