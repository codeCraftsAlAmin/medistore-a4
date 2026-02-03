import { medicineService } from "@/app/service/medicine.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Search,
  Pill,
  AlertCircle,
  Star,
  ArrowRight,
  Filter,
  CheckCircle2,
  Tag,
  Factory,
  Package,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { MedicineFilters } from "@/components/ui/MedicineFilters";
import { cn } from "@/lib/utils";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    price?: string;
    manufacturer?: string;
    sortBy?: string;
    sortOrder?: string;
    stock?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || "1";

  // Build query params for the API call
  const filters = {
    ...params,
    page: currentPage,
    limit: "8",
  };

  const { data: response, error } =
    await medicineService.getAllMedicines(filters);

  // Handle nested data structure
  const medicines = response?.data || [];
  const pagination = response?.paginations;

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20 rounded-2xl"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>
            {error.message ||
              "We encountered an issue loading the shop. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 mb-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            <Badge
              variant="outline"
              className="px-4 py-1 border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest font-bold"
            >
              Premium Healthcare
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Trusted Medicines <br />
              <span className="text-primary">Delivered with Care.</span>
            </h1>
            <p className="text-xl text-muted-foreground/80 max-w-2xl leading-relaxed">
              Find and order authentic pharmaceutical products from verified
              sellers. Safe, secure, and delivered to your doorstep.
            </p>

            <div className="pt-4">
              <Link href="/medicine">
                <Button size="lg" className="rounded-xl px-8 h-12 gap-2 group">
                  Browse Inventory{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Advanced Filters */}
        <MedicineFilters />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Available Medicines
              </h2>
              {pagination && (
                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="text-white font-medium">
                    {medicines.length}
                  </span>{" "}
                  of {pagination.totalMedicine} items
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map((medicine: any) => (
            <div
              key={medicine.id}
              className="group relative flex flex-col rounded-2xl border bg-card p-5 transition-all hover:shadow-lg"
            >
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {medicine.stock <= 10 && medicine.stock > 0 && (
                  <Badge
                    variant="destructive"
                    className="bg-rose-500 text-white border-none shadow-sm text-[10px] px-2 py-0.5"
                  >
                    Limited Stock
                  </Badge>
                )}
                {medicine.stock === 0 && (
                  <Badge
                    variant="destructive"
                    className="bg-zinc-800 text-zinc-400 border-white/5 px-2 py-0.5"
                  >
                    Sold Out
                  </Badge>
                )}
                {medicine.category?.name && (
                  <Badge
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white/70 text-[10px] uppercase font-bold px-2 py-0.5 backdrop-blur-md"
                  >
                    {medicine.category.name}
                  </Badge>
                )}
              </div>

              {/* Product Visual */}
              <div className="relative aspect-square mb-4 flex items-center justify-center rounded-xl bg-muted/50 overflow-hidden transition-colors group-hover:bg-muted">
                <div className="p-6 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-105">
                  <Pill className="h-16 w-16 text-primary opacity-30 group-hover:opacity-50 transition-opacity" />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 px-0.5">
                    <Factory className="size-3" />
                    {medicine.manufacturer}
                  </p>
                  <h3 className="font-bold text-xl leading-tight text-white group-hover:text-primary transition-colors line-clamp-1">
                    {medicine.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">
                      ${medicine.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">
                      per unit
                    </span>
                  </div>

                  {medicine._count?.reviews > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/5 border border-yellow-500/10">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-bold text-yellow-500/90">
                        {medicine._count.reviews}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground px-0.5">
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      medicine.stock > 0
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-zinc-700",
                    )}
                  />
                  {medicine.stock > 0
                    ? `${medicine.stock} units available`
                    : "Discontinued"}
                </div>
              </div>

              {/* Add to Cart Footer */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <AddToCartButton medicine={medicine} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {medicines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 rounded-[3rem] border border-dashed border-white/5 bg-card/20 backdrop-blur-sm">
            <div className="p-8 rounded-full bg-white/5 mb-8">
              <Pill className="h-20 w-20 text-muted-foreground/20" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Finding what you need...
            </h3>
            <p className="text-muted-foreground text-center max-w-sm px-6">
              We couldn't find any medicines matching those criteria. Try
              adjusted your search or clear filters.
            </p>
            <Button
              variant="outline"
              className="mt-8 rounded-full border-white/10"
              asChild
            >
              <Link href="/customer/shop">View All Medicines</Link>
            </Button>
          </div>
        )}

        {/* Premium Pagination */}
        {pagination && pagination.totalPage > 1 && (
          <div className="flex flex-col items-center gap-6 mt-20">
            <div className="flex items-center gap-3">
              <Link
                href={`/customer/shop?${new URLSearchParams({
                  ...params,
                  page: String(Math.max(1, Number(currentPage) - 1)),
                })}`}
                className={
                  Number(currentPage) <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              >
                <Button variant="outline" className="rounded-lg px-6 h-10">
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
                    if (pageNum === 2 || pageNum === pagination.totalPage - 1) {
                      return (
                        <span
                          key={pageNum}
                          className="px-2 text-muted-foreground"
                        >
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
                        className={cn(
                          "min-w-[40px] h-10 rounded-lg text-sm font-medium",
                          !isCurrentPage &&
                            "text-muted-foreground hover:text-white",
                        )}
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
                className={
                  Number(currentPage) >= pagination.totalPage
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              >
                <Button variant="outline" className="rounded-lg px-6 h-10">
                  Next
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.2em] font-bold">
              Page {pagination.page}{" "}
              <span className="mx-2 text-white/10">/</span>{" "}
              {pagination.totalPage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
