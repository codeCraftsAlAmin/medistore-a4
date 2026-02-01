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

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
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
  baseUrl = "/",
}: MedicineListProps) {
  const { page, totalPage, totalMedicine } = paginations;

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-sans">Medicine Name</TableHead>
              <TableHead className="font-sans">Manufacturer</TableHead>
              <TableHead className="font-sans">Stock</TableHead>
              <TableHead className="text-right font-sans">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-sans">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-sans">
                    {item.manufacturer}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.stock < 50 ? "destructive" : "secondary"}
                    >
                      {item.stock} in stock
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold font-sans">
                    ${item.price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center font-sans">
                  No medicines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination Footer --- */}
      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-sm text-muted-foreground font-sans">
          Showing <span className="font-medium">{data.length}</span> of{" "}
          <span className="font-medium">{totalMedicine}</span> medicines
        </p>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link href={`${baseUrl}?page=${page - 1}`}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Link>
            ) : (
              <span className="flex items-center opacity-50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </span>
            )}
          </Button>

          <div className="text-sm font-medium font-sans min-w-20 text-center">
            Page {page} of {totalPage || 1}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPage || totalPage === 0}
            asChild={page < totalPage}
          >
            {page < totalPage ? (
              <Link href={`${baseUrl}?page=${page + 1}`}>
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
