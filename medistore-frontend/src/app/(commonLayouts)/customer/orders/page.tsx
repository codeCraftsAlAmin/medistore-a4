import { orderService } from "@/app/service/order.service";
import { userService } from "@/app/service/user.service";
import {
  ShoppingBag,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  MessageSquarePlus,
  Hash,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CancelOrderButton } from "./CancelOrderButton";
import { ReviewModal } from "./ReviewModal";
import { cn } from "@/lib/utils";

const statusConfig = {
  PLACED: {
    label: "Order Placed",
    icon: <Clock className="size-4" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    description: "Your order is being reviewed by the seller.",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="size-4" />,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    description: "Your package is on its way to you.",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <CheckCircle2 className="size-4" />,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    description: "Order completed successfully.",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="size-4" />,
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    description: "This order has been cancelled.",
  },
} as const;

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
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            We couldn't retrieve your orders. Please check your connection and
            try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-white">
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
              <ShoppingBag className="h-8 w-8 text-primary shadow-sm" />
            </div>
            My Orders
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage your purchases and track delivery status in real-time.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 border-white/10 bg-white/5 text-white/70 font-mono"
        >
          Total Orders: {myOrders.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-card/20 backdrop-blur-sm">
            <div className="p-6 rounded-full bg-white/5 mb-6">
              <Package className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center max-w-xs px-4">
              Looks like you haven't placed any orders. Start shopping to find
              the best medicines!
            </p>
          </div>
        ) : (
          myOrders.map((order: any) => {
            const status =
              (order.status as keyof typeof statusConfig) || "PLACED";
            const config = statusConfig[status];

            return (
              <div
                key={order.id}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 backdrop-blur-md transition-all hover:border-white/10 hover:bg-card/60 shadow-xl"
              >
                {/* Status Indicator Bar */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1.5",
                    config.color.split(" ")[1],
                  )}
                />

                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    {/* Identification & Summary */}
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        <Hash className="size-3" />
                        ID: {order.id}
                      </div>

                      <h2 className="text-xl font-bold text-white line-clamp-2">
                        {order.orderItems
                          ?.map((item: any) => item.medicine?.name)
                          .join(", ") || "Untitled Order"}
                      </h2>

                      <div className="flex flex-wrap gap-6 pt-2">
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <Package className="size-4 text-primary" />
                          <span className="text-sm">
                            {order.orderItems?.reduce(
                              (acc: number, item: any) =>
                                acc + (item.quantity || 0),
                              0,
                            )}{" "}
                            Items
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <DollarSign className="size-4 text-primary" />
                          <span className="text-sm font-bold text-white">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <Calendar className="size-4 text-primary" />
                          <span className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              undefined,
                              { dateStyle: "medium" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-6 min-w-[240px]">
                      <div className="text-left lg:text-right space-y-2">
                        <Badge
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border",
                            config.color,
                          )}
                        >
                          {config.icon}
                          {config.label}
                        </Badge>
                        <p className="text-[11px] text-muted-foreground max-w-[200px]">
                          {config.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {order.status === "PLACED" && (
                          <CancelOrderButton orderId={order.id} />
                        )}

                        {(order.status === "SHIPPED" ||
                          order.status === "DELIVERED") && (
                          <div className="flex items-center gap-2">
                            <ReviewModal orderItems={order.orderItems} />
                          </div>
                        )}

                        <Badge
                          variant="secondary"
                          className="bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-white/5 p-2 rounded-xl"
                        >
                          <Hash className="size-4 text-muted-foreground" />
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
