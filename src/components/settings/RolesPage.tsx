"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleActionsModal } from "./RoleActionsModal";
import { ConfirmDeleteRoleModal } from "./ConfirmDeleteRoleModal";
import { useRoleStore } from "@/store/roleStore";

export function RolesPage() {
  const { roles, loading, error, createRole, updateRole, deleteRole, fetchRoles } = useRoleStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<any | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const handleCreate = async (data: { name: string; permissions: string[] }) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await createRole(data);
      setCreateOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Failed to create role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (data: { name: string; permissions: string[] }) => {
    if (!selectedRole) return;
    setActionError(null);
    setActionLoading(true);
    try {
      await updateRole(selectedRole._id, data);
      setEditOpen(false);
      setSelectedRole(null);
    } catch (err: any) {
      setActionError(err.message || "Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRole) return;
    setActionError(null);
    setActionLoading(true);
    try {
      await deleteRole(selectedRole._id);
      setDeleteOpen(false);
      setSelectedRole(null);
    } catch (err: any) {
      setActionError(err.message || "Failed to delete role");
    } finally {
      setActionLoading(false);
    }
  };

  // Prevent infinite loop by only calling fetchRoles once on mount
  React.useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Roles</h1>
        <Button onClick={() => { setCreateOpen(true); setActionError(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
      <RoleActionsModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={handleCreate}
        loading={actionLoading}
        error={actionError}
      />
      <RoleActionsModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedRole(null);
        }}
        mode="edit"
        initial={selectedRole ? { name: selectedRole.name, permissions: selectedRole.permissions } : {}}
        onSubmit={handleEdit}
        loading={actionLoading}
        error={actionError}
      />
      <ConfirmDeleteRoleModal
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedRole(null);
        }}
        roleName={selectedRole?.name || ""}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <Table>
        <TableCaption>
          A list of your team's roles.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role: any) => (
            <TableRow key={role._id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={() => { setSelectedRole(role); setEditOpen(true); setActionError(null); }}
                  disabled={loading}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => { setSelectedRole(role); setDeleteOpen(true); setActionError(null); }}
                  disabled={loading}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
