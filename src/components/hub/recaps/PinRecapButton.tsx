import React from "react";
import { usePinsStore } from "@/store/pinsStore";
import { Button } from "@/components/ui/button";
import { Pin } from "lucide-react";

interface PinRecapButtonProps {
  recapId: string;
}

export function PinRecapButton({ recapId }: PinRecapButtonProps) {
  const { pinnedRecaps, pinRecap, loading } = usePinsStore();
  const isPinned = pinnedRecaps.some(r => r._id === recapId);

  return (
    <Button
      variant={isPinned ? "secondary" : "outline"}
      size="sm"
      className="mb-3 flex items-center gap-1"
      onClick={() => {
        if (!isPinned && !loading) pinRecap(recapId);
      }}
      disabled={isPinned || loading}
      aria-label={isPinned ? "Pinned" : "Add Pin"}
    >
      <Pin size={16} className={isPinned ? "text-yellow-500" : ""} />
      {isPinned ? "Pinned" : loading ? "Pinning..." : "Add Pin"}
    </Button>
  );
}
