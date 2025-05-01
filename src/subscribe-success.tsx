import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "./services/api";

interface StripePlan {
  name?: string;
  nickname?: string;
}

export default function SubscribeSuccess() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<StripePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<unknown>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setError("No session ID provided.");
      setLoading(false);
      return;
    }
    // Call backend to verify session and get plan info
    api
      .get(`http://localhost:5000/api/stripe/session/${sessionId}`)
      .then(async (res) => {
        console.log(res);
        setPlan(res.plan);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to verify session.");
        setErrorDetails(err);
        setLoading(false);
      });
  }, [location]);

  let errorDetailsString: string | null = null;
  if (errorDetails) {
    if (typeof errorDetails === "string") errorDetailsString = errorDetails;
    else if (errorDetails instanceof Error)
      errorDetailsString = errorDetails.message;
    else
      errorDetailsString =
        "Something went wrong. Please try again or contact support.";
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Verifying payment...
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <div className="mb-2 font-bold">{error}</div>
        {errorDetailsString && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-xs max-w-xl text-center">
            {errorDetailsString}
          </div>
        )}
        <button
          onClick={() => navigate("/subscribe")}
          className="btn btn-primary mt-6"
        >
          Back to Subscribe
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
      {plan && (
        <div className="mb-4">
          <p>
            You are now subscribed to the <b>{plan.name || plan.nickname}</b>{" "}
            plan.
          </p>
        </div>
      )}
      <button onClick={() => navigate("/hub")} className="btn btn-primary mt-6">
        Go to Dashboard
      </button>
    </div>
  );
}
