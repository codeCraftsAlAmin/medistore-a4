"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleCancelOrder } from "@/app/actions/order.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onCancel() {
    setIsLoading(true);
    const result = await handleCancelOrder(orderId);

    if (result.success) {
      router.refresh(); // This triggers a re-fetch of server component data
    } else {
      alert(result.error?.message || "Failed to cancel order");
    }
    setIsLoading(false);
  }

  return (
    <Button
      onClick={onCancel}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-destructive hover:bg-destructive/10 text-xs"
    >
      <XCircle className="mr-1 h-3 w-3" />
      {isLoading ? "Cancelling..." : "Cancel"}
    </Button>
  );
}
