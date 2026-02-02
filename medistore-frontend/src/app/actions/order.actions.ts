"use server";

import { revalidatePath } from "next/cache";
import { orderService } from "../service/order.service";

// ✅ NEW: Action for CUSTOMERS to place an order
export async function createOrderAction(orderData: {
  medicineId: string;
  quantity: number;
  address: string;
}) {
  const res = await orderService.createOrder(orderData);

  if (!res.error) {
    // Refresh the customer's order list and the public medicine stock
    revalidatePath("/customer/orders");
    revalidatePath("/medicine");
  }

  return res;
}

// ✅ EXISTING: Action for SELLERS to update status (Keep this!)
export async function updateOrderStatusAction(orderId: string, status: string) {
  const res = await orderService.updateOrderStatus(orderId, status);

  if (!res.error) {
    revalidatePath("/seller/orders");
    revalidatePath("/customer/orders"); // Also refresh for the customer
  }

  return res;
}

export async function cancelOrderAction(orderId: string) {
  const res = await orderService.cancelOrder(orderId);
  if (!res.error) {
    revalidatePath("/customer/orders");
    revalidatePath("/seller/orders");
  }
  return res;
}
