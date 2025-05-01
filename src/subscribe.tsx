// src/pages/Subscribe.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { api } from "./services/api";

// Define a type for Stripe plan
interface StripePlan {
  id: string;
  nickname: string | null;
  unit_amount: number | null;
  currency: string;
  interval: string | undefined;
  product: string | undefined;
  metadata: Record<string, string>;
  product_metadata: Record<string, string> | undefined;
}

export default function Subscribe() {
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch plans from backend
    api.get("http://localhost:5000/api/stripe/plans").then((res) => {
      setPlans(res.data);
    });
  }, []);

  const handleSubscribe = async () => {
    if (!selected) return;
    if (!isAuthenticated) {
      navigate(`/login?tab=signup&plan_id=${selected}`);
      return;
    }
    // Logged in: proceed to Stripe Checkout
    setLoading(selected);
    const { data } = await api.post(
      "http://localhost:5000/api/stripe/create-checkout-session",
      {
        plan_id: selected,
      }
    );
    window.location.href = data.url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
      <div className="flex flex-wrap gap-8 mb-8">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`rounded-lg border-2 p-6 w-64 text-left shadow transition-all focus:outline-none focus:ring-2 focus:ring-primary/60 ${
              selected === plan.id
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "border-border bg-card hover:border-primary/40"
            }`}
            onClick={() => setSelected(plan.id)}
            aria-pressed={selected === plan.id}
            tabIndex={0}
          >
            <h2 className="text-xl font-semibold mb-2">
              {plan.product || plan.nickname}
            </h2>
            <p className="text-2xl font-bold mb-2">
              {plan.unit_amount
                ? `${(plan.unit_amount / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: plan.currency.toUpperCase(),
                  })}`
                : "-"}
              {plan.interval ? ` / ${plan.interval}` : ""}
            </p>
            <p className="text-muted-foreground mb-4">
              {plan.product_metadata?.description ||
                plan.metadata?.description ||
                ""}
            </p>
            {selected === plan.id && (
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary text-white">
                Selected
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary px-8 py-3 text-lg rounded-lg font-semibold shadow"
        onClick={handleSubscribe}
        disabled={loading !== null}
      >
        {loading ? "Redirecting..." : "Subscribe"}
      </button>
      <button
        className="mt-6 underline text-muted-foreground"
        onClick={async () => {
          const { data } = await axios.post("/api/stripe/customer-portal");
          window.location.href = data.url;
        }}
      >
        Manage Subscription
      </button>
    </div>
  );
}
