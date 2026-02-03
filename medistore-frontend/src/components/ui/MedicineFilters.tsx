"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RotateCcw,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Tag,
  Factory,
  DollarSign,
  Package,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
}

interface MedicineFiltersProps {
  categories: Category[];
}

export function MedicineFilters({ categories }: MedicineFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for input fields to avoid excessive re-renders/URL updates while typing
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [manufacturer, setManufacturer] = useState(
    searchParams.get("manufacturer") || "",
  );

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Always reset to page 1 when filters change
      if (Object.keys(params).some((key) => key !== "page")) {
        newSearchParams.set("page", "1");
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("search", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    setManufacturer("");
    router.push(pathname);
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-white/5 rounded-xl p-6 mb-8 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Field */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines by name..."
              className="pl-10 h-11 bg-zinc-950/50 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-11 px-6">
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          {/* Reset Button */}
          <Button
            variant="outline"
            className="h-11 gap-2 border-white/10"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          {/* Advanced Filters Toggle (Optional Placeholder) */}
          <Button variant="secondary" className="h-11 gap-2 md:hidden">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Tag className="h-3 w-3" />
            Category
          </label>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(val) =>
              handleFilterChange("category", val === "all" ? null : val)
            }
          >
            <SelectTrigger className="h-11 bg-zinc-950/50 border-white/10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Manufacturer Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Factory className="h-3 w-3" />
            Manufacturer
          </label>
          <div className="relative">
            <Input
              placeholder="Any manufacturer..."
              className="h-11 bg-zinc-950/50 border-white/10 pr-10"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              onBlur={() => handleFilterChange("manufacturer", manufacturer)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleFilterChange("manufacturer", manufacturer)
              }
            />
          </div>
        </div>

        {/* Price Sorting */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
            <ArrowUpDown className="h-3 w-3" />
            Sort By
          </label>
          <Select
            value={`${searchParams.get("sortBy") || "createdAt"}-${searchParams.get("sortOrder") || "desc"}`}
            onValueChange={(val) => {
              const [sortBy, sortOrder] = val.split("-");
              handleFilterChange("sortBy", sortBy);
              // Small delay or use local state if needed, but for select this is usually fine
              const newSearchParams = new URLSearchParams(
                searchParams.toString(),
              );
              newSearchParams.set("sortBy", sortBy);
              newSearchParams.set("sortOrder", sortOrder);
              router.push(`${pathname}?${newSearchParams.toString()}`);
            }}
          >
            <SelectTrigger className="h-11 bg-zinc-950/50 border-white/10">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Package className="h-3 w-3" />
            Availability
          </label>
          <Select
            value={searchParams.get("stock") || "all"}
            onValueChange={(val) =>
              handleFilterChange("stock", val === "all" ? null : val)
            }
          >
            <SelectTrigger className="h-11 bg-zinc-950/50 border-white/10">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="1">In Stock Only</SelectItem>
              <SelectItem value="10">More than 10</SelectItem>
              <SelectItem value="100">More than 100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
