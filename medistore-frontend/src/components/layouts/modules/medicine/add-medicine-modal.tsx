"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createMedicineAction } from "@/app/actions/medicine.actions";
import { toast } from "sonner";

// Type matching your Category API structure
interface Category {
  id: string;
  name: string;
}

// 1. Fixed Schema: Using z.coerce to ensure TS knows these are numbers
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Please select a category"),
});

// 2. Extract the type correctly
type MedicineFormValues = z.infer<typeof formSchema>;

export function AddMedicineModal({
  categories = [],
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);

  // 3. Explicitly pass the type to useForm to resolve Error 2322/2345
  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      manufacturer: "",
      price: 0,
      stock: 0,
      category: "",
    },
  });

  async function onSubmit(values: MedicineFormValues) {
    const res = await createMedicineAction(values);

    if (res?.error) {
      toast.error(res.error.message || "Something went wrong");
    } else {
      toast.success("Medicine added successfully!");
      setOpen(false);
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-sans">
          <Plus className="mr-2 h-4 w-4" /> Add Medicine
        </Button>
      </DialogTrigger>
      {/* sm:max-w-106.25 is the canonical version of 425px as per your tailwind linter */}
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Napa Extend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Beximco Pharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Use value instead of defaultValue for better control
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No categories available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Save Medicine"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
