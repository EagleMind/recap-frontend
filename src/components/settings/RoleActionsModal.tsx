"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RoleActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: { name?: string; permissions?: string[] };
  onSubmit: (data: { name: string; permissions: string[] }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function RoleActionsModal({ open, onOpenChange, mode, initial = {}, onSubmit, loading, error }: RoleActionsModalProps) {
  const [name, setName] = React.useState(initial.name || "");
  const [permissions, setPermissions] = React.useState<string[]>(initial.permissions || []);
  const [localError, setLocalError] = React.useState<string | null>(null);

  // Only reset state when modal transitions from closed to open
  const prevOpenRef = React.useRef(open);
  React.useEffect(() => {
    if (!prevOpenRef.current && open) {
      setName(initial.name || "");
      setPermissions(initial.permissions || []);
      setLocalError(null);
    }
    prevOpenRef.current = open;
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!name.trim()) {
      setLocalError("Role name is required");
      return;
    }
    try {
      await onSubmit({ name: name.trim(), permissions });
      onOpenChange(false);
    } catch (err: any) {
      setLocalError(err.message || "Failed to save role");
    }
  };

  // For demo, simple permissions input as comma-separated
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Role name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            placeholder="Permissions (comma separated)"
            value={permissions.join(", ")}
            onChange={e => setPermissions(e.target.value.split(",").map(p => p.trim()).filter(Boolean))}
            disabled={loading}
          />
          {(localError || error) && <div className="text-red-600 text-sm">{localError || error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? (mode === "edit" ? "Saving..." : "Creating...") : (mode === "edit" ? "Save" : "Create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
