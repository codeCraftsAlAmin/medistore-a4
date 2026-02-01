"use server";

import { revalidatePath } from "next/cache";
import { orderService } from "../service/order.service";

export async function updateOrderStatusAction(orderId: string, status: string) {
  const res = await orderService.updateOrderStatus(orderId, status);

  if (!res.error) {
    revalidatePath("/seller/orders");
  }

  return res;
}
