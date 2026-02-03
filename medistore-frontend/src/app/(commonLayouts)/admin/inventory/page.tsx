import { medicineService } from "@/app/service/medicine.service";
import {
  LayoutDashboard,
  Pill,
  DollarSign,
  Store,
  Tag,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminInventoryPage() {
  const { data: medRes } = await medicineService.getAllMedicines();
  const medicines = medRes?.data || [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl text-slate-200">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Global Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of all medicines listed by sellers on the platform.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-fit py-1 px-4 border-primary/30 text-primary"
        >
          Total Products: {medicines.length}
        </Badge>
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Seller/Manufacturer</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {medicines.map((med: any) => (
                  <tr
                    key={med.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Pill className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{med.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            ID: {med.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-300 font-medium">
                          Mfg: {med.manufacturer}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Store className="h-2.5 w-2.5" />
                          <span>
                            Seller ID: {med.userId.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-primary/50" />
                        <span className="capitalize">
                          {med.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ${med.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            med.stock < 10
                              ? "text-rose-500 font-bold"
                              : "text-white"
                          }
                        >
                          {med.stock}
                        </span>
                        {med.stock < 10 && (
                          <AlertTriangle className="h-3 w-3 text-rose-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {med.stock > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-0 h-5"
                        >
                          In Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="bg-rose-500/10 text-rose-500 border-rose-500/20 py-0 h-5"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {medicines.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-sans">
                Inventory is empty.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
