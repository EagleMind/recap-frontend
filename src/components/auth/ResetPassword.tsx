import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/authService";

export function ResetPassword() {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset token");

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      await authService.resetPassword(token, newPassword);
      setIsSubmitted(true);

      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                placeholder="••••••••"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Reset Password
            </Button>
            {isSubmitted && (
              <Alert variant="default" className="mt-4">
                <AlertDescription className="text-sm">
                  Password successfully reset. Redirecting to login in{" "}
                  {countdown}...
                </AlertDescription>
              </Alert>
            )}
            {error && !isSubmitted && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            Back to Login
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
