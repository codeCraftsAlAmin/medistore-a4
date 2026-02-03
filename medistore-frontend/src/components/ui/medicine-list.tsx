"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
  category?: { name: string };
}

interface Pagination {
  page: number;
  limit: number;
  totalMedicine: number;
  totalPage: number;
}

interface MedicineListProps {
  data: Medicine[];
  paginations: Pagination;
  baseUrl?: string;
}

export function MedicineList({
  data = [],
  paginations,
  baseUrl = "/medicine",
}: MedicineListProps) {
  const { page, totalPage, totalMedicine } = paginations;
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/5 bg-card/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="font-sans text-white/70">
                Medicine Name
              </TableHead>
              <TableHead className="font-sans text-white/70">
                Manufacturer
              </TableHead>
              <TableHead className="font-sans text-white/70">
                Category
              </TableHead>
              <TableHead className="font-sans text-white/70">Stock</TableHead>
              <TableHead className="text-right font-sans text-white/70">
                Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-white/5 border-white/5 transition-colors"
                >
                  <TableCell className="font-medium font-sans text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-sans text-slate-400">
                    {item.manufacturer}
                  </TableCell>
                  <TableCell className="font-sans text-slate-400">
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-primary/5 text-primary"
                    >
                      {item.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={item.stock < 10 ? "destructive" : "secondary"}
                        className={
                          item.stock >= 10
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : ""
                        }
                      >
                        {item.stock} in stock
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold font-sans text-primary">
                    ${item.price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center font-sans text-muted-foreground"
                >
                  No medicines found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination Footer --- */}
      <div className="flex items-center justify-between px-2 pt-2 pb-6">
        <p className="text-sm text-muted-foreground font-sans">
          Showing <span className="font-medium text-white">{data.length}</span>{" "}
          of <span className="font-medium text-white">{totalMedicine}</span>{" "}
          medicines
        </p>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
            className="border-white/10 hover:bg-white/5"
          >
            {page > 1 ? (
              <Link href={createPageURL(page - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Link>
            ) : (
              <span className="flex items-center opacity-50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </span>
            )}
          </Button>

          <div className="text-sm font-medium font-sans min-w-20 text-center text-slate-400">
            Page <span className="text-white">{page}</span> of{" "}
            <span className="text-white">{totalPage || 1}</span>
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPage || totalPage === 0}
            asChild={page < totalPage}
            className="border-white/10 hover:bg-white/5"
          >
            {page < totalPage ? (
              <Link href={createPageURL(page + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <span className="flex items-center opacity-50 cursor-not-allowed">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
