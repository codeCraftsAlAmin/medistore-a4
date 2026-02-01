import React from "react";
import { orderService } from "@/app/service/order.service";
import { OrderTable } from "@/components/layouts/modules/order/order-table";

export default async function SalesOrdersPage(): Promise<React.JSX.Element> {
  // Fetch orders using the service we just created
  const { data: orders, error } = await orderService.getOrders();

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
        <p className="text-muted-foreground font-sans">
          Manage and track customer medicine requests.
        </p>
      </div>

      {/* If no orders exist, show a friendly message */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">No orders found yet.</p>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
