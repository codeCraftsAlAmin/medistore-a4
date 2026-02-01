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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Medicine</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">
                {order.id.slice(-6).toUpperCase()}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {order.userId.slice(-6).toUpperCase()}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {order.address}
              </TableCell>
              <TableCell>
                {order.orderItems
                  ?.map((item: any) => item.medicine?.name)
                  .join(", ") || "Unknown Product"}
              </TableCell>
              <TableCell>
                {order.orderItems?.reduce(
                  (total: number, item: any) => total + item.quantity,
                  0,
                ) || 0}
              </TableCell>
              <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "DELIVERED" ? "default" : "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-32.5 ml-auto">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLACED">Placed</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
