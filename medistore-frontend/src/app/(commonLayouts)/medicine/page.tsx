import { medicineService } from "@/app/service/medicine.service";
import { AddMedicineModal } from "@/components/layouts/modules/medicine/add-medicine-modal";
import { MedicineList } from "@/components/ui/medicine-list";

export default async function MedicinePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page) : 1;

  // Fetch everything in parallel - ONLY ONCE
  const [medRes, catRes] = await Promise.all([
    medicineService.getAllMedicines({ page: currentPage, limit: 10 }),
    medicineService.getCategories(),
  ]);

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
        <AddMedicineModal categories={catRes.data || []} />
      </div>

      <MedicineList
        data={medRes.data?.data || []}
        paginations={medRes.data?.paginations}
        baseUrl="/medicine"
      />
    </div>
  );
}
