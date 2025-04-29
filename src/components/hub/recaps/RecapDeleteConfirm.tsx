import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRecapsStore } from "@/store/recapsStore";

interface RecapDeleteConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recapId: string;
  recapTitle?: string;
}

export function RecapDeleteConfirm({ open, onOpenChange, recapId, recapTitle }: RecapDeleteConfirmProps) {
  const { deleteRecap, clearError, clearSuccess, error, success } = useRecapsStore();
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      clearError();
      clearSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDelete = async () => {
    if (!recapId) return;
    setSubmitting(true);
    await deleteRecap(recapId);
    setSubmitting(false);
    if (!error) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Recap</DialogTitle>
        </DialogHeader>
        <div className="py-4">Are you sure you want to delete <b>{recapTitle || 'this recap'}</b>?</div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        {success && <div className="text-success text-sm">{success}</div>}
        <DialogFooter>
          <Button onClick={handleDelete} variant="destructive" disabled={submitting || !recapId}>{submitting ? "Deleting..." : "Delete"}</Button>
          <DialogClose asChild>
            <Button variant="ghost" disabled={submitting}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
