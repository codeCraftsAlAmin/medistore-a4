"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, KeyRound, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <Card className="w-full max-w-sm border-white/5 bg-card/40 backdrop-blur-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="size-6 text-rose-500" />
            </div>
          </div>
          <CardTitle className="text-center text-white font-sans font-black">
            Invalid Link
          </CardTitle>
          <CardDescription className="text-center">
            The reset password link is missing or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full rounded-xl"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully! You can now login.");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-white/5 bg-card/40 backdrop-blur-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
            <KeyRound className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-white font-sans font-black">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Secure your account with a new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2 text-white">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-950/50 border-white/10 rounded-xl h-11"
              required
            />
          </div>
          <div className="space-y-2 text-white">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-zinc-950/50 border-white/10 rounded-xl h-11"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl shadow-glow gap-2 text-black font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Suspense
        fallback={<Loader2 className="size-8 animate-spin text-primary" />}
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
