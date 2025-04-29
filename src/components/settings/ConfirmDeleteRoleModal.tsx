"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDeleteRoleModal({ open, onOpenChange, roleName, onConfirm, loading }: ConfirmDeleteRoleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          Are you sure you want to delete the role <span className="font-semibold">{roleName}</span>?
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
