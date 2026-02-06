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
  Hash,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CancelOrderButton } from "./CancelOrderButton";
import { ReviewModal } from "./ReviewModal";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusConfig = {
  PLACED: {
    label: "Placed",
    icon: <Clock className="size-3" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    description: "In review",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="size-3" />,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    description: "On the way",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <CheckCircle2 className="size-3" />,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    description: "Completed",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="size-3" />,
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    description: "Closed",
  },
} as const;

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const { data: sessionData } = await userService.getSession();
  const currentUser = sessionData?.user;

  const { data: allOrders, error } = await orderService.getOrders();

  const myOrders =
    currentUser && allOrders
      ? allOrders
          .filter((order: any) => order.userId === currentUser.id)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
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
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-white font-sans">
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
              <ShoppingBag className="h-8 w-8 text-primary shadow-sm" />
            </div>
            My Orders
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage your purchases and track delivery status.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 border-white/10 bg-white/5 text-white/70 font-mono"
        >
          Platform Total: {myOrders.length}
        </Badge>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-card/20 backdrop-blur-sm">
          <div className="p-6 rounded-full bg-white/5 mb-6">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-sans">
            No orders yet
          </h3>
          <p className="text-muted-foreground text-center max-w-xs px-4">
            Looks like you haven't placed any orders. Start shopping to find the
            best medicines!
          </p>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/5 bg-card/40 backdrop-blur-md overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-6 pl-8 text-primary font-bold uppercase tracking-widest text-[10px]">
                  Order Info
                </TableHead>
                <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
                  Products
                </TableHead>
                <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
                  Date
                </TableHead>
                <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
                  Total Amount
                </TableHead>
                <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
                  Status
                </TableHead>
                <TableHead className="py-6 pr-8 text-right text-primary font-bold uppercase tracking-widest text-[10px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myOrders.map((order: any) => {
                const statusKey = order.status as keyof typeof statusConfig;
                const config = statusConfig[statusKey] || statusConfig.PLACED;
                const itemCount = order.orderItems?.reduce(
                  (acc: number, item: any) => acc + (item.quantity || 0),
                  0,
                );

                return (
                  <TableRow
                    key={order.id}
                    className="border-white/5 hover:bg-white/[0.02] group transition-colors"
                  >
                    <TableCell className="py-6 pl-8 align-middle">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                        <Hash className="size-3" />
                        {order.id.split("-")[0]}...
                      </div>
                    </TableCell>

                    <TableCell className="py-6 align-middle">
                      <div className="max-w-[300px]">
                        <p className="text-sm font-bold text-white truncate">
                          {order.orderItems
                            ?.map((item: any) => item.medicine?.name)
                            .join(", ") || "Untitled Order"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                          {itemCount} {itemCount === 1 ? "Item" : "Items"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-6 align-middle">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="size-3.5 text-primary/50" />
                        <span className="text-xs font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            undefined,
                            { dateStyle: "medium" },
                          )}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-6 align-middle">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-emerald-500" />
                        <span className="text-sm font-extrabold text-white">
                          {order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-6 align-middle">
                      <Badge
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                          config.color,
                        )}
                      >
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-6 pr-8 text-right align-middle">
                      <div className="flex items-center justify-end gap-3">
                        {order.status === "PLACED" && (
                          <CancelOrderButton orderId={order.id} />
                        )}

                        {(order.status === "SHIPPED" ||
                          order.status === "DELIVERED") && (
                          <ReviewModal orderItems={order.orderItems} />
                        )}

                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Hash className="size-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
