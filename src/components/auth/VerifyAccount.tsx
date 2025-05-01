import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }
    axios
      .get(`/api/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(
          res.data.msg || "Email verified successfully. You can now log in."
        );
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.msg ||
            "Verification failed. The link may be invalid or expired."
        );
      });
  }, [searchParams]);

  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {status === "pending" && <p>Verifying your email...</p>}
        {status !== "pending" && (
          <>
            <p
              className={
                status === "success" ? "text-green-600" : "text-red-600"
              }
            >
              {message}
            </p>
            {status === "success" && (
              <p className="mt-4 text-muted-foreground">
                Redirecting to login in 3 seconds...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
