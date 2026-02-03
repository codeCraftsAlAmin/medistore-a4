"use server";

import { reviewService } from "@/app/service/review.service";
import { userService } from "@/app/service/user.service";
import { medicineService } from "@/app/service/medicine.service";
import { revalidatePath } from "next/cache";

export async function adminDeleteReview(reviewId: string) {
  try {
    const res = await reviewService.deleteReview(reviewId);
    if (res.success) {
      revalidatePath("/admin/reviews");
      return { success: true, message: "Review moderated and removed." };
    }
    return { success: false, message: res.message || "Failed to delete." };
  } catch (error) {
    return { success: false, message: "Server error occurred." };
  }
}

export async function handleUpdateUserStatus(
  userId: string,
  isBlocked: boolean,
) {
  try {
    const status = isBlocked ? "BAN" : "UNBAN";
    const res = await userService.updateUserStatus(userId, status);
    if (res.success) {
      revalidatePath("/admin/users");
      return { success: true, message: res.message || "User status updated." };
    }
    return {
      success: false,
      message: res.message || "Failed to update status.",
    };
  } catch (error) {
    return { success: false, message: "Server error occurred." };
  }
}

export async function handleCreateCategory(name: string) {
  try {
    const res = await medicineService.createCategory(name);
    if (res.success) {
      revalidatePath("/admin/categories");
      revalidatePath("/medicine");
      return { success: true, message: "Category created successfully." };
    }
    return {
      success: false,
      message: res.message || "Failed to create category.",
    };
  } catch (error) {
    return { success: false, message: "Server error occurred." };
  }
}

export async function handleUpdateCategory(id: string, name: string) {
  try {
    const res = await medicineService.updateCategory(id, name);
    if (res.success) {
      revalidatePath("/admin/categories");
      revalidatePath("/medicine");
      return { success: true, message: "Category updated successfully." };
    }
    return {
      success: false,
      message: res.message || "Failed to update category.",
    };
  } catch (error) {
    return { success: false, message: "Server error occurred." };
  }
}

export async function handleDeleteCategory(id: string) {
  try {
    const res = await medicineService.deleteCategory(id);
    if (res.success) {
      revalidatePath("/admin/categories");
      revalidatePath("/medicine");
      return { success: true, message: "Category deleted successfully." };
    }
    return {
      success: false,
      message: res.message || "Failed to delete category.",
    };
  } catch (error) {
    return { success: false, message: "Server error occurred." };
  }
}
