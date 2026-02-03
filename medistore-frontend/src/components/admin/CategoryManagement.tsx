"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} from "@/app/actions/admin.actions";
import { Plus, Pencil, Trash2, Loader2, X, Check, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function CategoryManagement({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<{
    id?: string;
    name: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddDialog = () => {
    setCurrentCategory({ name: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!currentCategory?.name.trim()) {
      return toast.error("Category name is required");
    }

    setIsSubmitting(true);
    try {
      let res;
      if (currentCategory.id) {
        res = await handleUpdateCategory(
          currentCategory.id,
          currentCategory.name,
        );
      } else {
        res = await handleCreateCategory(currentCategory.name);
      }

      if (res.success) {
        toast.success(res.message);
        setIsDialogOpen(false);
        // Page will revalidate via server action, but we could also manual refresh if needed
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    toast.loading("Deleting...", { id: "delete-cat" });
    try {
      const res = await handleDeleteCategory(id);
      if (res.success) {
        toast.success(res.message, { id: "delete-cat" });
        window.location.reload();
      } else {
        toast.error(res.message, { id: "delete-cat" });
      }
    } catch (error) {
      toast.error("Failed to delete.", { id: "delete-cat" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/5">
        <div>
          <h2 className="text-xl font-semibold text-white">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Define categories for the medicine inventory.
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Tag className="h-4 w-4" />
                </div>
                <span className="font-medium text-slate-200">{cat.name}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white"
                  onClick={() => openEditDialog(cat)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <p className="text-muted-foreground font-sans">
            No categories found. Start by adding one!
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {currentCategory?.id ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., Antibiotics, Painkillers"
              value={currentCategory?.name || ""}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory!,
                  name: e.target.value,
                })
              }
              className="bg-white/5 border-white/10 text-white focus:border-primary/50"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
