import React from "react";

const PLANS = [
  {
    id: "price_...", // Stripe price ID for Small
    name: "Small",
    price: "$29/mo",
    limits: "3 teams, 20 members/team, 200 recaps/team, 20 AI calls",
  },
  {
    id: "price_...", // Medium
    name: "Medium",
    price: "$99/mo",
    limits: "10 teams, 100 members/team, 1000 recaps/team, 200 AI calls",
  },
  {
    id: "price_...", // Large
    name: "Large",
    price: "$249/mo",
    limits: "Unlimited",
  },
];

export default function SubscribePlansModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Upgrade Your Plan</h2>
        <p>You have reached your team limit. Upgrade to add more teams!</p>
        <div style={{ display: "flex", gap: 24 }}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{ border: "1px solid #ccc", padding: 24 }}
            >
              <h3>{plan.name}</h3>
              <p>{plan.price}</p>
              <p>{plan.limits}</p>
              <form action="/api/stripe/create-checkout-session" method="POST">
                <input type="hidden" name="plan_id" value={plan.id} />
                <button type="submit">Choose {plan.name}</button>
              </form>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 24 }}>
          Close
        </button>
      </div>
    </div>
  );
}
