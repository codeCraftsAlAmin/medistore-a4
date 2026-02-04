import { medicineService } from "@/app/service/medicine.service";
import { AddMedicineModal } from "@/components/layouts/modules/medicine/add-medicine-modal";
import { MedicineList } from "@/components/ui/medicine-list";
import { userService } from "@/app/service/user.service";
import { MedicineFilters } from "@/components/ui/MedicineFilters";

export default async function MedicinePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    manufacturer?: string;
    stock?: string;
    sortBy?: string;
    sortOrder?: string;
    price?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page) : 1;

  // Extract filters
  const filters = {
    page: currentPage,
    limit: 10,
    search: params.search,
    category: params.category,
    manufacturer: params.manufacturer,
    stock: params.stock,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    price: params.price,
  };

  // Fetch everything in parallel - ONLY ONCE
  const [medRes, catRes, sessionRes] = await Promise.all([
    medicineService.getAllMedicines(filters),
    medicineService.getCategories(),
    userService.getSession(),
  ]);

  const userRole = sessionRes?.data?.user?.role;
  // Handle medicine fetch errors
  if (medRes.error) {
    return (
      <div className="p-10 text-red-500">Error: {medRes.error.message}</div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Medicine Inventory
          </h1>
          <p className="text-muted-foreground font-sans">
            Manage available medicines.
          </p>
        </div>

        {/* Pass the corrected data */}
        {userRole === "SELLER" && (
          <AddMedicineModal categories={catRes.data || []} />
        )}
      </div>
      <MedicineFilters />

      <MedicineList
        data={medRes.data?.data || []}
        paginations={medRes.data?.paginations}
        baseUrl="/medicine"
      />
    </div>
  );
}
