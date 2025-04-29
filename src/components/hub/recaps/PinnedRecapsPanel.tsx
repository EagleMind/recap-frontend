import { usePinsStore } from "@/store/pinsStore";
import { Pin } from "lucide-react";
import * as React from "react";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PinnedRecapsPanelProps {
  onSelect: (recap: any) => void;
}

export function PinnedRecapsPanel({ onSelect }: PinnedRecapsPanelProps) {
  const { pinnedRecaps, fetchPins, unpinRecap } = usePinsStore();

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);


  if (pinnedRecaps.length === 0) {
    return (
      <aside className="w-64 p-4 text-sidebar-foreground h-full flex flex-col gap-2 items-center justify-center">
        <Pin size={28} className="opacity-40 mb-2" />
        <div className="text-center text-muted-foreground text-sm">
          No pinned recaps yet.<br />
          <span className="text-xs">Pin your favorite recaps for quick access!</span>
        </div>
      </aside>
    );
  }
  return (
    <aside className="w-64 p-4 text-sidebar-foreground h-full flex flex-col gap-2">
      <span className="flex items-center gap-2">
        <Pin size={18} /> <div className="font-semibold ">Pinned Recaps</div>

      </span>
      <div className="flex flex-col gap-2">
        {pinnedRecaps.map(recap => (
          <div
            key={recap._id}
            className="rounded border border-border bg-card text-card-foreground px-3 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-muted/70"
            onClick={() => onSelect(recap)}
          >
            <span className="truncate max-w-xs">{recap.title}</span>
            <Button
              variant="outline"
              onClick={e => { e.stopPropagation(); unpinRecap(recap._id); }}
            >Unpin</Button>
          </div>
        ))}
      </div>
    </aside>
  );
}
