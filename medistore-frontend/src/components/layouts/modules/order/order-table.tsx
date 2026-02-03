"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "@/app/actions/order.actions";
import { toast } from "sonner";
import {
  Hash,
  User,
  MapPin,
  Package,
  DollarSign,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  PLACED: {
    label: "Placed",
    icon: <Clock className="size-3" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  PROCESSING: {
    label: "Processing",
    icon: <Package className="size-3" />,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="size-3" />,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <CheckCircle2 className="size-3" />,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
} as const;

export function OrderTable({ orders }: { orders: any[] }) {
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success(`Order marked as ${newStatus}`);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/5 bg-card/40 backdrop-blur-md overflow-hidden shadow-2xl">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="py-6 pl-8 text-primary font-bold uppercase tracking-widest text-[10px]">
              Order ID
            </TableHead>
            <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
              Customer Details
            </TableHead>
            <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
              Delivery Address
            </TableHead>
            <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
              Medicines
            </TableHead>
            <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
              Revenue
            </TableHead>
            <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
              Status
            </TableHead>
            <TableHead className="py-6 pr-8 text-right text-primary font-bold uppercase tracking-widest text-[10px]">
              Update
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status =
              (order.status as keyof typeof statusConfig) || "PLACED";
            const config = statusConfig[status] || statusConfig.PLACED;
            const itemCount =
              order.orderItems?.reduce(
                (total: number, item: any) => total + item.quantity,
                0,
              ) || 0;

            return (
              <TableRow
                key={order.id}
                className="border-white/5 hover:bg-white/[0.02] group transition-colors"
              >
                <TableCell className="py-6 pl-8 align-middle">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    <Hash className="size-3" />
                    {order.id.slice(-6).toUpperCase()}
                  </div>
                </TableCell>

                <TableCell className="py-6 align-middle">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <User className="size-3 text-primary/50" />
                      {order.user?.name || "Unknown"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium lowercase">
                      {order.user?.email || "No email"}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-6 align-middle">
                  <div className="flex items-start gap-2 max-w-[200px]">
                    <MapPin className="size-3.5 mt-0.5 text-primary/50 shrink-0" />
                    <span className="text-xs text-slate-400 leading-relaxed truncate hover:whitespace-normal transition-all cursor-help">
                      {order.address}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-6 align-middle">
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-white truncate max-w-[200px]">
                      {order.orderItems
                        ?.map((item: any) => item.medicine?.name)
                        .join(", ") || "Unknown Product"}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      <Package className="size-3 text-primary/30" />
                      {itemCount} {itemCount === 1 ? "Unit" : "Units"}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-6 align-middle">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-emerald-500" />
                    <span className="text-sm font-extrabold text-white">
                      {order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-6 align-middle">
                  <Badge
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all",
                      config.color,
                    )}
                  >
                    {config.icon}
                    {config.label}
                  </Badge>
                </TableCell>

                <TableCell className="py-6 pr-8 text-right align-middle">
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value)
                    }
                    defaultValue={order.status}
                  >
                    <SelectTrigger className="h-9 w-[130px] ml-auto bg-zinc-950/50 border-white/5 hover:border-primary/30 transition-all rounded-lg text-[11px] font-bold uppercase tracking-wider">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="PLACED" className="text-xs">
                        Placed
                      </SelectItem>
                      <SelectItem value="PROCESSING" className="text-xs">
                        Processing
                      </SelectItem>
                      <SelectItem value="SHIPPED" className="text-xs">
                        Shipped
                      </SelectItem>
                      <SelectItem value="DELIVERED" className="text-xs">
                        Delivered
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
