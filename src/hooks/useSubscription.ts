// src/hooks/useSubscription.ts
import { useEffect, useState } from "react";
import axios from "axios";

export function useSubscription() {
  const [limits, setLimits] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/user/subscription")
      .then((res) => setLimits(res.data.limits));
  }, []);

  return limits;
}
