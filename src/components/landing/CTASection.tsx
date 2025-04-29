import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");

  const handleSignUp = () => {
    const emailParam = encodeURIComponent(email);
    navigate(`/login?email=${emailParam}&tab=signup`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-2xl px-4 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="text-muted-foreground">
          Join thousands of teams using Recap to stay organized and productive.
        </p>
        <div className="flex gap-4 justify-center">
          <Input
            placeholder="Enter your email"
            className="max-w-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
      </div>
    </section>
  );
}
