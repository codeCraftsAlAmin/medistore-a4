import { orderService } from "@/app/service/order.service";
import { OrderTable } from "@/components/layouts/modules/order/order-table";
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function SalesOrdersPage(): Promise<React.JSX.Element> {
  // Fetch orders using the service we just created
  const { data: orders, error } = await orderService.getOrders();

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
            {error.message ||
              "We couldn't retrieve your orders. Please check your connection."}
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
              <LayoutDashboard className="h-8 w-8 text-primary shadow-sm" />
            </div>
            Sales Orders
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage and track customer medicine requests and platform revenue.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 border-white/10 bg-white/5 text-white/70 font-mono"
        >
          Total Requests: {orders?.length || 0}
        </Badge>
      </div>

      {/* If no orders exist, show a friendly message */}
      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-card/20 backdrop-blur-sm">
          <div className="p-6 rounded-full bg-white/5 mb-6">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-sans">
            No sales found
          </h3>
          <p className="text-muted-foreground text-center max-w-xs px-4">
            You haven't received any orders yet. Once customers start buying
            your medicines, they'll appear here.
          </p>
        </div>
      ) : (
        <OrderTable
          orders={orders.filter((o: any) => o.status !== "CANCELLED")}
        />
      )}
    </div>
  );
}
