"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/lib/toast";

import { useRoleStore } from "@/store/roleStore";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { name: string; email: string; roleId?: string }) => Promise<void>;
}

export function AddMemberModal({ open, onOpenChange, onAdd }: AddMemberModalProps) {
  const { roles, loading: rolesLoading, error: rolesError, fetchRoles } = useRoleStore();

  React.useEffect(() => {
    if (open) fetchRoles();
  }, [open, fetchRoles]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [roleId, setRoleId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onAdd({ name, email, roleId });
      setName("");
      setEmail("");
      setRoleId(undefined);
      onOpenChange(false);
      showSuccess("Member added successfully!");
    } catch (err: any) {
      const errorMsg = err.message || "Failed to add member";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
            disabled={rolesLoading}
          >
            <option value="">{rolesLoading ? "Loading roles..." : "Select Role (optional)"}</option>
            {roles.map(role => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
          {rolesError && <div className="text-red-600 text-sm">{rolesError}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Member"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
