"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createOrderAction } from "@/app/actions/order.actions";
import { Textarea } from "@/components/ui/textarea";
// import { Textarea } from "@/components/ui/textarea";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
}

export function AddToCartButton({ medicine }: { medicine: Medicine }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= medicine.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (medicine.stock === 0) return;
    setIsDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await createOrderAction({
        medicineId: medicine.id,
        quantity: quantity,
        address: address.trim(),
      });

      if (result.error) {
        setError(result.error.message || "Failed to place order");
      } else {
        // Success! Close dialog and redirect
        setIsDialogOpen(false);
        router.push("/customer/orders");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = (medicine.price * quantity).toFixed(2);

  return (
    <>
      {/* Quantity Selector and Add Button */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">Quantity:</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || medicine.stock === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max={medicine.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-16 text-center h-8"
              disabled={medicine.stock === 0}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= medicine.stock || medicine.stock === 0}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full gap-2 shadow-sm"
          disabled={medicine.stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {medicine.stock === 0 ? "Out of Stock" : "Add to Order"}
        </Button>
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Review your order details and provide delivery address.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Order Summary */}
            <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
              <div className="flex justify-between">
                <span className="font-medium">{medicine.name}</span>
                <span className="text-sm text-muted-foreground">
                  {medicine.manufacturer}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per unit:</span>
                <span>${medicine.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">${totalPrice}</span>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isLoading}>
              {isLoading ? "Placing Order..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
