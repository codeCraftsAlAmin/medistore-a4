import { medicineService } from "@/app/service/medicine.service";
import { userService } from "@/app/service/user.service"; // ✅ Use your service instead
import { StockTable } from "@/components/layouts/modules/inventory/stock-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Package } from "lucide-react";

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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground font-sans">
            Monitor stock levels and update quantities for your products.
          </p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">
            Low Stock Warning
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            You have {lowStockItems.length} items with fewer than 10 units
            remaining.
          </AlertDescription>
        </Alert>
      )}

      {medicines.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No medicines found in your inventory.
          </p>
        </div>
      ) : (
        <StockTable medicines={medicines} />
      )}
    </div>
  );
}
