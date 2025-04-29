"use client";

import * as React from "react";
import { TeamMembers } from "../teamManagement/TeamMembers";
import { useTeamStore } from "@/store/teamStore";
import type { TeamMember } from "../types";

import { useNavigate } from "react-router-dom";
import { useTeamMemberStore } from "@/store/teamMemberStore";
import { AddMemberModal } from "./AddMemberModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { teamService } from "@/services/teamService";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MemberEditForm } from "./MemberEditForm";

export function MembersPage() {
  const members = useTeamStore((state) => state.members);
  const fetchMembers = useTeamStore((state) => state.fetchMembers);
  const isLoading = useTeamStore((state) => state.isLoading);
  const error = useTeamStore((state) => state.error);
  const activeTeam = useTeamStore((state) => state.activeTeam);

  const navigate = useNavigate();

  const [addOpen, setAddOpen] = React.useState(false);

  const deleteMember = useTeamMemberStore((state) => state.deleteMember);
  const teamMemberLoading = useTeamMemberStore((state) => state.loading);
  const teamMemberError = useTeamMemberStore((state) => state.error);

  React.useEffect(() => {
    fetchMembers();
  }, []);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [memberToEdit, setMemberToEdit] = React.useState<TeamMember | null>(null);

  const handleEdit = (member: TeamMember) => {
    setMemberToEdit(member);
    setEditModalOpen(true);
  };

  function handleEditSuccess() {
    setEditModalOpen(false);
    setMemberToEdit(null);
    fetchMembers();
  }

  function handleEditCancel() {
    setEditModalOpen(false);
    setMemberToEdit(null);
  }

  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [memberToDelete, setMemberToDelete] = React.useState<TeamMember | null>(null);

  const handleRemove = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!activeTeam || !memberToDelete) return;
    await deleteMember(activeTeam.teamId, memberToDelete.memberId);
    setDeleteModalOpen(false);
    setMemberToDelete(null);
    fetchMembers();
  };


  const handleInviteMember = async ({ name, email, roleId }: { name: string; email: string; roleId?: string }) => {
    if (!activeTeam) throw new Error("No active team");
    await teamService.invite(activeTeam.teamId, { name, email, roleId });
    fetchMembers();
    setAddOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <span className="flex items-center">
          <Button
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </span>

      </div>

      <AddMemberModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleInviteMember}
      />
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {teamMemberError && <div className="mb-4 text-red-600">{teamMemberError}</div>}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setMemberToDelete(null);
        }}
        memberName={memberToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        loading={teamMemberLoading}
      />
      {/* Edit Member Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {memberToEdit && (
            <MemberEditForm
              memberId={memberToEdit.memberId}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          )}
        </DialogContent>
      </Dialog>
      {isLoading || teamMemberLoading ? (
        <div>Loading...</div>
      ) : (
        <TeamMembers
          members={members}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}

