import { cn } from "@/lib/utils";

interface TimelineProps {
  dates: string[];
  recapsByDate: Record<string, any[]>;
  onSelectRecap: (recap: any) => void;
  selectedRecapId?: string;
  pinnedRecapIds: string[];
  onPinRecap: (id: string) => void;
}

export function Timeline({ dates, recapsByDate, onSelectRecap, selectedRecapId, pinnedRecapIds, onPinRecap }: TimelineProps) {
  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-border z-0" />
      {dates.map((date, i) => (
        <div key={date} className="flex w-full items-start z-10">
          <div className="flex flex-col items-center mr-4">
            <div className={cn("w-4 h-4 rounded-full border-2", i === 0 ? "bg-primary border-primary" : "bg-card border-border")}></div>
            {i < dates.length - 1 && <div className="w-px flex-1 bg-border" style={{ minHeight: 32 }} />}
          </div>
          <div className="flex-1 py-2">
            <div className="text-xs text-muted-foreground mb-1">{date}</div>
            <div className="flex flex-col gap-2">
              {recapsByDate[date]?.map((recap) => (
                <div
                  key={recap.id}
                  className={cn(
                    "rounded-lg border border-border bg-card px-4 py-2 shadow transition cursor-pointer flex items-center justify-between gap-2",
                    recap.id === selectedRecapId && "border-primary ring-2 ring-primary",
                    pinnedRecapIds.includes(recap.id) && "bg-yellow-50 border-yellow-400"
                  )}
                  onClick={() => onSelectRecap(recap)}
                >
                  <span className="truncate max-w-xs">{recap.title}</span>
                  <button
                    className={cn("ml-2 text-xs px-2 py-1 rounded border", pinnedRecapIds.includes(recap.id) ? "bg-yellow-300 border-yellow-500" : "bg-muted border-border")}
                    onClick={e => { e.stopPropagation(); onPinRecap(recap.id); }}
                  >{pinnedRecapIds.includes(recap.id) ? "Unpin" : "Pin"}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
