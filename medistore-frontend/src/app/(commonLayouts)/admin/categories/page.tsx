import { medicineService } from "@/app/service/medicine.service";
import { FolderTree, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CategoryManagement } from "@/components/admin/CategoryManagement";

export default async function AdminCategoriesPage() {
  const { data: categoriesResponse } = await medicineService.getCategories();
  const categories = categoriesResponse || [];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl text-slate-200">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <FolderTree className="h-8 w-8 text-primary" />
            Category Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize medicine inventory by creating and managing categories.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-fit py-1 px-4 border-primary/30 text-primary"
        >
          Total Categories: {categories.length}
        </Badge>
      </div>

      <CategoryManagement initialCategories={categories} />
    </div>
  );
}
