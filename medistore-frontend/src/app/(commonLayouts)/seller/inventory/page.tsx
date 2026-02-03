import { medicineService } from "@/app/service/medicine.service";
import { userService } from "@/app/service/user.service"; // ✅ Use your service instead
import { StockTable } from "@/components/layouts/modules/inventory/stock-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Package,
  TrendingUp,
  AlertTriangle,
  Box,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function ManageInventoryPage() {
  // 1. Get the session from your backend via your service
  const { data: sessionData, error: sessionError } =
    await userService.getSession();

  // The user object is inside sessionData
  const currentUser = sessionData?.user;

  // 2. Fetch medicines
  const { data, error: fetchError } = await medicineService.getAllMedicines({
    limit: 100,
  });
  const allMedicines = data?.data || [];

  // 3. Filter: Only show products belonging to the current seller
  const medicines = currentUser
    ? allMedicines.filter((m: any) => m.userId === currentUser.id)
    : [];

  const lowStockItems = medicines.filter((m: any) => m.stock < 10);

  // Handle errors for either session or medicine fetching
  if (fetchError || sessionError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {fetchError?.message ||
              sessionError?.message ||
              "Failed to load data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const outOfStockCount = medicines.filter((m: any) => m.stock === 0).length;
  const totalValue = medicines.reduce(
    (acc: number, m: any) => acc + m.price * m.stock,
    0,
  );

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-white font-sans">
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
              <TrendingUp className="h-8 w-8 text-primary shadow-sm" />
            </div>
            Manage Inventory
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Strategic control over your pharmaceutical stock and distribution.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 border-white/10 bg-white/5 text-white/70 font-mono"
        >
          Unique SKU Count: {medicines.length}
        </Badge>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Total Items
                </p>
                <h3 className="text-2xl font-black text-white">
                  {medicines.length}
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Box className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Low Stock
                </p>
                <h3 className="text-2xl font-black text-amber-500">
                  {lowStockItems.length}
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <AlertTriangle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Out of Stock
                </p>
                <h3 className="text-2xl font-black text-rose-500">
                  {outOfStockCount}
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <AlertCircle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-primary/20 bg-primary/5 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">
                  Inventory Value
                </p>
                <h3 className="text-2xl font-black text-white">
                  ${totalValue.toFixed(2)}
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-primary/20 text-primary shadow-glow">
                <DollarSign className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-[2.5rem] border border-dashed border-white/10 bg-card/20 backdrop-blur-md shadow-2xl">
          <div className="p-8 rounded-full bg-white/5 mb-6 ring-1 ring-white/10">
            <Package className="h-16 w-16 text-muted-foreground/30 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 font-sans italic">
            Inventory Empty
          </h3>
          <p className="text-muted-foreground text-center max-w-sm px-6 font-medium">
            You haven't listed any medicines for sale yet. Start adding products
            from your dashboard to begin business.
          </p>
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-white/5 bg-card/30 backdrop-blur-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <StockTable medicines={medicines} />
        </div>
      )}
    </div>
  );
}
