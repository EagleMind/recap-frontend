import { Pin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PinSidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function PinSidebarToggle({ open, onToggle }: PinSidebarToggleProps) {
  return (
    <Button
      variant={open ? "secondary" : "outline"}
      size="icon"
      className="md:hidden sticky top-4 z-30 flex justify-center items-center  gap-3"
      aria-label={open ? "Hide pinned recaps" : "Show pinned recaps"}
      onClick={onToggle}
    >
      <Pin className={open ? "text-blue-500" : ""} />
    </Button>
  );
}
