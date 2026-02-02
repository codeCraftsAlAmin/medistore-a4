"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Correct shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateStockAction,
  updateMedicineNameAction,
  deleteMedicineAction,
} from "@/app/actions/medicine.actions";
import { toast } from "sonner";
import { Save, Trash2, AlertTriangle } from "lucide-react";

export function StockTable({ medicines }: { medicines: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdate = async (item: any, newStockValue: string) => {
    const stockNum = parseInt(newStockValue);
    if (isNaN(stockNum) || stockNum < 0) return toast.error("Invalid quantity");

    setLoadingId(item.id || item._id);
    // Pass the full item object so the action can extract the required fields
    const res = await updateStockAction(item, stockNum);
    setLoadingId(null);

    if (res.error) {
      toast.error(res.error.message || "Unauthorized or invalid data");
    } else {
      toast.success("Inventory updated successfully");
    }
  };

  const handleUpdateName = async (id: string, newName: string) => {
    if (!newName.trim()) return toast.error("Name cannot be empty");

    setLoadingId(id);
    const res = await updateMedicineNameAction(id, newName.trim());
    setLoadingId(null);

    if (res.error) {
      toast.error(res.error.message || "Failed to update name");
    } else {
      toast.success("Medicine name updated successfully");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure? This cannot be undone if there's no order history.",
      )
    )
      return;

    setLoadingId(id);
    const res = await deleteMedicineAction(id);
    setLoadingId(null);

    if (res.error) {
      // Shows backend error: "Cannot delete medicine with active order history"
      toast.error(res.error.message);
    } else {
      toast.success("Medicine removed from inventory");
    }
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicine</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[180px]">Set Stock</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((item) => (
            <TableRow key={item.id || item._id}>
              <TableCell>
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleUpdateName(
                      item.id || item._id,
                      formData.get("name") as string,
                    );
                  }}
                >
                  <Input
                    name="name"
                    defaultValue={item.name}
                    className="h-8 flex-1 font-sans"
                    disabled={loadingId === (item.id || item._id)}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    disabled={loadingId === (item.id || item._id)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </form>
                <div className="text-xs text-muted-foreground font-sans mt-1">
                  {item.manufacturer}
                </div>
              </TableCell>
              <TableCell>
                {item.stock < 10 ? (
                  <div className="flex items-center text-red-500 gap-1 text-sm font-bold">
                    <AlertTriangle className="h-4 w-4" /> Low: {item.stock}
                  </div>
                ) : (
                  <div className="text-green-600 text-sm font-medium">
                    {item.stock} in stock
                  </div>
                )}
              </TableCell>
              <TableCell>
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleUpdate(item, formData.get("stock") as string);
                  }}
                >
                  <Input
                    name="stock"
                    type="number"
                    defaultValue={item.stock}
                    className="h-8 w-20 font-sans"
                    disabled={loadingId === (item.id || item._id)}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    disabled={loadingId === (item.id || item._id)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </form>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDelete(item.id || item._id)}
                  disabled={loadingId === (item.id || item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
