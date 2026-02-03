"use client";

import React, { useState } from "react";
import {
  User as UserIcon,
  Settings,
  LogOut,
  Check,
  Loader2,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/store/useAuth";
import { updateProfileAction } from "@/app/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const { user, logout, setAuth, token } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (newName === user.name) {
      setIsDialogOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateProfileAction({
        id: user.id,
        name: newName.trim(),
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success("Profile updated successfully!");
        // Update local auth state if possible, though router.refresh()
        // might be needed for server components
        if (token) {
          setAuth({ ...user, name: newName.trim() }, token);
        }
        setIsDialogOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-white/10 hover:bg-white/5 transition-all"
          >
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
              <UserIcon className="size-5" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none text-white">
                {user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground uppercase tracking-widest font-mono pt-1">
                {user.role}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer gap-2"
          >
            <Settings className="size-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer gap-2 text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="size-5 text-primary" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your display name here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                className="bg-zinc-950/50 border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateName}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
