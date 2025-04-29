import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarSidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function CalendarSidebarToggle({ open, onToggle }: CalendarSidebarToggleProps) {
  return (
    <Button
      variant={open ? "secondary" : "outline"}
      size="icon"
      className="md:hidden sticky top-4 z-30 flex justify-center items-center gap-3"
      aria-label={open ? "Hide calendar" : "Show calendar"}
      onClick={onToggle}
    >
      <Calendar className={open ? "text-blue-500" : ""} />
    </Button>
  );
}
