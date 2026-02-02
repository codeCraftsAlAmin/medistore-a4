import { medicineService } from "@/app/service/medicine.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Pill, AlertCircle, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    price?: string;
    manufacturer?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || "1";

  // Build query params for the API call
  const queryParams = {
    ...params,
    page: currentPage,
    limit: "4", // Show 12 items per page
  };

  const { data: response, error } =
    await medicineService.getAllMedicines(queryParams);

  console.log("API Response:", JSON.stringify(response, null, 2));

  // Handle nested data structure: response.data.data contains the array
  const medicines = Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data)
      ? response.data
      : [];
  const pagination = response?.data?.paginations || response?.paginations;

  console.log("Medicines:", medicines);
  console.log("Pagination:", pagination);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load shop items."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Medicine Shop
          </h1>
          <p className="text-muted-foreground">
            Search and order authentic medicines safely.
          </p>
        </div>

        <form className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search by name or brand..."
              defaultValue={params.search}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Active Filters Display */}
      {(params.search || params.category) && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {params.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {params.search}
              <Link
                href="/customer/shop"
                className="ml-1 hover:text-destructive"
              >
                ×
              </Link>
            </Badge>
          )}
          {params.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {params.category}
              <Link
                href={`/customer/shop?search=${params.search || ""}`}
                className="ml-1 hover:text-destructive"
              >
                ×
              </Link>
            </Badge>
          )}
          <Link href="/customer/shop">
            <Button variant="ghost" size="sm" className="h-7">
              Clear all
            </Button>
          </Link>
        </div>
      )}

      {/* Results Count */}
      {pagination && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing {medicines.length} of {pagination.totalMedicine} medicines
        </p>
      )}

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medicines.map((medicine: any) => (
          <div
            key={medicine.id}
            className="group flex flex-col rounded-xl border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="relative aspect-square mb-4 flex items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-muted">
              <Pill className="h-16 w-16 text-muted-foreground/30" />
              {medicine.stock <= 10 && medicine.stock > 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Low Stock: {medicine.stock}
                </Badge>
              )}
              {medicine.stock === 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {medicine.manufacturer}
                  </p>
                </div>
                {medicine.category?.name && (
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase shrink-0"
                  >
                    {medicine.category.name}
                  </Badge>
                )}
              </div>

              {/* Reviews Display */}
              {medicine._count?.reviews > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-muted-foreground">
                    {medicine._count.reviews}{" "}
                    {medicine._count.reviews === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">
                  ${medicine.price.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">/ unit</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Stock: {medicine.stock} available
              </p>
            </div>

            {/* Add to Cart Button with Quantity Selector */}
            <AddToCartButton medicine={medicine} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {medicines.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed rounded-xl mt-10">
          <Pill className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg font-medium">
            No medicines found matching your search.
          </p>
          <Button variant="link" className="mt-2" asChild>
            <Link href="/customer/shop">Clear all filters</Link>
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Link
            href={`/customer/shop?${new URLSearchParams({
              ...params,
              page: String(Math.max(1, Number(currentPage) - 1)),
            })}`}
          >
            <Button variant="outline" disabled={Number(currentPage) === 1}>
              Previous
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPage)].map((_, index) => {
              const pageNum = index + 1;
              const isCurrentPage = Number(currentPage) === pageNum;

              // Show first page, last page, current page, and pages around current
              const showPage =
                pageNum === 1 ||
                pageNum === pagination.totalPage ||
                Math.abs(pageNum - Number(currentPage)) <= 1;

              if (!showPage) {
                // Show ellipsis
                if (pageNum === 2 || pageNum === pagination.totalPage - 1) {
                  return (
                    <span key={pageNum} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Link
                  key={pageNum}
                  href={`/customer/shop?${new URLSearchParams({
                    ...params,
                    page: String(pageNum),
                  })}`}
                >
                  <Button
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/customer/shop?${new URLSearchParams({
              ...params,
              page: String(
                Math.min(pagination.totalPage, Number(currentPage) + 1),
              ),
            })}`}
          >
            <Button
              variant="outline"
              disabled={Number(currentPage) === pagination.totalPage}
            >
              Next
            </Button>
          </Link>
        </div>
      )}

      {pagination && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Page {pagination.page} of {pagination.totalPage}
        </p>
      )}
    </div>
  );
}
