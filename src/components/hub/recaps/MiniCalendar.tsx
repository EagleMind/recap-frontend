import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

interface MiniCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  availableDates: string[];
}

export function MiniCalendar({ selectedDate, onSelectDate, availableDates }: MiniCalendarProps) {
  // Convert availableDates to Date objects for comparison
  const available = React.useMemo(() => new Set(availableDates.map(d => new Date(d).toDateString())), [availableDates]);

  function isDayDisabled(date: Date) {
    return !available.has(date.toDateString());
  }

  return (
    <aside className=" h-full flex flex-col gap-2">
      <div className="font-semibold mb-2">Jump to Date</div>
      <Calendar
        mode="single"
        selected={selectedDate ? new Date(selectedDate) : undefined}
        onSelect={(date: Date | undefined) => {
          if (date) {
            // Format as YYYY-MM-DD to match recapsByDate keys
            const ymd = date.toISOString().slice(0, 10);
            onSelectDate(ymd);
          }
        }}
        disabled={(date: Date) => isDayDisabled(date)}
        modifiers={{ available: (date: Date) => available.has(date.toDateString()) }}
        modifiersClassNames={{ available: "bg-primary/10" }}
      />
    </aside>
  );
}
