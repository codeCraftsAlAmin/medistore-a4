"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateStockAction,
  updateMedicineNameAction,
  deleteMedicineAction,
} from "@/app/actions/medicine.actions";
import { toast } from "sonner";
import {
  Save,
  Trash2,
  AlertTriangle,
  Hash,
  Package,
  Building2,
  Edit3,
  Zap,
  Loader2,
  Check,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StockTable({ medicines }: { medicines: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = async (item: any, newStockValue: string) => {
    const stockNum = parseInt(newStockValue);
    if (isNaN(stockNum) || stockNum < 0) return toast.error("Invalid quantity");

    setLoadingId(item.id || item._id);
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
      setEditingId(null);
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
      toast.error(res.error.message);
    } else {
      toast.success("Medicine removed from inventory");
    }
  };

  return (
    <Table className="bg-transparent">
      <TableHeader className="bg-white/5 backdrop-blur-sm">
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="py-6 pl-8 text-primary font-bold uppercase tracking-widest text-[10px]">
            SKU & Product Name
          </TableHead>
          <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px]">
            Stock Health
          </TableHead>
          <TableHead className="py-6 text-primary font-bold uppercase tracking-widest text-[10px] w-[200px]">
            Direct Inventory Adjustment
          </TableHead>
          <TableHead className="py-6 pr-8 text-right text-primary font-bold uppercase tracking-widest text-[10px]">
            Management
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicines.map((item) => {
          const itemId = item.id || item._id;
          const isLowStock = item.stock < 10;
          const isOutOfStock = item.stock === 0;

          return (
            <TableRow
              key={itemId}
              className="border-white/5 hover:bg-white/[0.02] group transition-colors"
            >
              <TableCell className="py-6 pl-8 align-middle">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    <Hash className="size-3" />
                    {itemId.slice(-8).toUpperCase()}
                  </div>

                  {editingId === itemId ? (
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleUpdateName(
                          itemId,
                          formData.get("name") as string,
                        );
                      }}
                    >
                      <Input
                        name="name"
                        autoFocus
                        defaultValue={item.name}
                        className="h-9 min-w-[200px] bg-zinc-950/50 border-primary/30 text-sm font-bold text-white ring-1 ring-primary/20"
                        disabled={loadingId === itemId}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 bg-primary/20 text-primary hover:bg-primary/30"
                        disabled={loadingId === itemId}
                      >
                        {loadingId === itemId ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground"
                        onClick={() => setEditingId(null)}
                      >
                        <XCircle className="size-4" />
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 group/title">
                      <h4 className="text-sm font-bold text-white">
                        {item.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover/title:opacity-100 h-6 w-6 text-primary/50 hover:text-primary transition-all"
                        onClick={() => setEditingId(itemId)}
                      >
                        <Edit3 className="size-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                    <Building2 className="size-3" />
                    {item.manufacturer}
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-6 align-middle">
                <div className="flex flex-col gap-2">
                  {isOutOfStock ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-full w-fit">
                      <Zap className="size-3" /> Critical: Out of Stock
                    </div>
                  ) : isLowStock ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
                      <AlertTriangle className="size-3" /> Warning: Low Stock (
                      {item.stock})
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                      <PackageCheck className="size-3" /> Optimal: {item.stock}{" "}
                      Units
                    </div>
                  )}
                  <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000",
                        isOutOfStock
                          ? "w-0"
                          : isLowStock
                            ? "w-1/4 bg-amber-500"
                            : "w-full bg-emerald-500",
                      )}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-6 align-middle">
                <form
                  className="flex items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleUpdate(item, formData.get("stock") as string);
                  }}
                >
                  <div className="relative">
                    <Input
                      name="stock"
                      type="number"
                      defaultValue={item.stock}
                      className="h-10 w-24 bg-zinc-950/30 border-white/5 focus:border-primary/50 text-center font-mono font-bold text-white pl-7"
                      disabled={loadingId === itemId}
                    />
                    <Package className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 px-4 bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all font-bold uppercase tracking-widest text-[10px] gap-2"
                    disabled={loadingId === itemId}
                  >
                    {loadingId === itemId ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <>
                        <Save className="size-3" /> Apply
                      </>
                    )}
                  </Button>
                </form>
              </TableCell>

              <TableCell className="py-6 pr-8 text-right align-middle">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                    onClick={() => handleDelete(itemId)}
                    disabled={loadingId === itemId}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
