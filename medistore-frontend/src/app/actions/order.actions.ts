"use server";

import { revalidatePath } from "next/cache";
import { orderService } from "../service/order.service";
import { redirect } from "next/navigation";

/**
 * Create a new order
 * Backend expects: { address: string, items: [{medicineId: string, quantity: number}] }
 */
export async function createOrderAction(orderData: {
  medicineId: string;
  quantity: number;
  address: string;
}) {
  // Transform single item into the array format backend expects
  const backendFormat = {
    address: orderData.address,
    items: [
      {
        medicineId: orderData.medicineId,
        quantity: orderData.quantity,
      },
    ],
  };

  const res = await orderService.createOrder(backendFormat);

  if (!res.error) {
    // Refresh the customer's order list and the shop page
    revalidatePath("/customer/orders");
    revalidatePath("/customer/shop");
  }

  return res;
}

/**
 * Update order status (for sellers)
 */
export async function updateOrderStatusAction(orderId: string, status: string) {
  const res = await orderService.updateOrderStatus(orderId, status);

  if (!res.error) {
    revalidatePath("/seller/orders");
    revalidatePath("/customer/orders");
  }

  return res;
}

/**
 * Cancel an order (for customers)
 */
export async function handleCancelOrder(orderId: string) {
  const res = await orderService.cancelOrder(orderId);

  revalidatePath("/customer/orders");

  if (!res.error) {
    redirect("/customer/orders");
  }

  return { success: false, error: res.error };
}