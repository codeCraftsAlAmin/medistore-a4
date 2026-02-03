import { orderService } from "@/app/service/order.service";
import {
  ShoppingBag,
  Calendar,
  User,
  MapPin,
  BadgeDollarSign,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminOrdersPage() {
  const { data: ordersResponse } = await orderService.getOrders();
  const orders = ordersResponse || [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl text-slate-200">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Global Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor all transactions and order fulfillment across the platform.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-fit py-1 px-4 border-primary/30 text-primary"
        >
          Total Orders: {orders.length}
        </Badge>
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Shipping Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-[10px] text-primary">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-white">
                          {order.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ${order.totalPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={`capitalize font-medium ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : order.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[120px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.address}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-sans">
                No orders found in the system.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
