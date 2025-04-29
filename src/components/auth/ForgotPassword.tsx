import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { authService } from "@/services/authService";

export function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await authService.forgotPassword(email);
      setIsSubmitted(true);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to send reset email. Please try again.";
      setError(errorMsg);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Send Reset Link
            </Button>
            {isSubmitted && (
              <Alert variant="default" className="mt-4">
                <AlertDescription className="text-sm">
                  If an account exists with {email}, you'll receive a reset link
                  shortly.
                </AlertDescription>
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
