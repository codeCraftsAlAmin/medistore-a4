import { orderService } from "@/app/service/order.service";
import { userService } from "@/app/service/user.service";
import { ShoppingBag, AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleCancelOrder } from "@/app/actions/order.actions";

// Create a client component for the cancel button
import { CancelOrderButton } from "./CancelOrderButton";

export default async function CustomerOrdersPage() {
  const { data: sessionData } = await userService.getSession();
  const currentUser = sessionData?.user;

  const { data: allOrders, error } = await orderService.getOrders();

  const myOrders =
    currentUser && allOrders
      ? allOrders.filter((order: any) => order.userId === currentUser.id)
      : [];

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load orders.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          My Orders
        </h1>
        <p className="text-muted-foreground">
          Track and manage your medicine requests.
        </p>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Medicine</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Total Price</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              myOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4 font-mono text-xs uppercase text-muted-foreground">
                    {order.id.split("-")[0]}...
                  </td>

                  <td className="p-4 font-medium">
                    {order.orderItems
                      ?.map((item: any) => item.medicine?.name)
                      .join(", ") || "N/A"}
                  </td>

                  <td className="p-4">
                    {order.orderItems?.reduce(
                      (acc: number, item: any) => acc + (item.quantity || 0),
                      0,
                    )}
                  </td>

                  <td className="p-4 font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          order.status === "SHIPPED" ? "outline" : "secondary"
                        }
                        className={
                          order.status === "SHIPPED"
                            ? "border-green-500 text-green-500"
                            : order.status === "CANCELLED"
                              ? "border-red-500 text-red-500"
                              : ""
                        }
                      >
                        {order.status}
                      </Badge>

                      {order.status === "PLACED" && (
                        <CancelOrderButton orderId={order.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
