"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleUpdateUserStatus } from "@/app/actions/admin.actions";
import { Loader2, Ban, ShieldCheck } from "lucide-react";

export function UserStatusToggle({
  userId,
  initialStatus,
}: {
  userId: string;
  initialStatus: "BAN" | "UNBAN";
}) {
  const [isBlocking, setIsBlocking] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const toggleStatus = async () => {
    setIsBlocking(true);
    try {
      const isBlocked = status === "BAN";
      const res = await handleUpdateUserStatus(userId, !isBlocked);
      if (res.success) {
        setStatus(isBlocked ? "UNBAN" : "BAN");
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating status.");
    } finally {
      setIsBlocking(false);
    }
  };

  const isBanned = status === "BAN";

  return (
    <Button
      variant={isBanned ? "outline" : "destructive"}
      size="sm"
      className="gap-2 h-8"
      onClick={toggleStatus}
      disabled={isBlocking}
    >
      {isBlocking ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isBanned ? (
        <ShieldCheck className="h-4 w-4" />
      ) : (
        <Ban className="h-4 w-4" />
      )}
      {isBanned ? "Unban User" : "Ban User"}
    </Button>
  );
}
