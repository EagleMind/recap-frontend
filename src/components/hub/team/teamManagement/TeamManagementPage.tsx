import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "@/store/teamStore";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Team } from "@/types/team";
import { useState } from "react";
import { ConfirmDeleteTeamModal } from "./ConfirmDeleteTeamModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamEditForm } from "./TeamEditForm";
import { useUserStore } from "@/store/userStore";
import SubscribePlansModal from "./SubscribePlansModal";

export default function TeamManagementPage() {
  const teams = useTeamStore((state) => state.teams);
  const fetchTeams = useTeamStore((state) => state.fetchTeams);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const user = useUserStore((state) => state.user);
  const error = useTeamStore((state) => state.error);
  const navigate = useNavigate();

  const teamsLimit = user?.plan?.limits?.teams_limit
    ? parseInt(user.plan.limits.teams_limit)
    : undefined;
  const atLimit = teamsLimit !== undefined && teams.length >= teamsLimit;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  React.useEffect(() => {
    fetchTeams();
  }, []);

  function handleCreate() {
    if (atLimit) {
      setModalOpen(true);
    } else {
      navigate("/hub/team/manage/new");
    }
  }

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

  function handleEdit(teamId: string) {
    const team = teams.find((t) => t.teamId === teamId);
    setTeamToEdit(team || null);
    setEditModalOpen(true);
  }

  function handleEditSuccess() {
    setEditModalOpen(false);
    setTeamToEdit(null);
    fetchTeams();
  }

  function handleEditCancel() {
    setEditModalOpen(false);
    setTeamToEdit(null);
  }

  async function handleConfirmDelete() {
    if (teamToDelete) {
      setLoading(true);
      await deleteTeam(teamToDelete.teamId);
      setLoading(false);
      setDeleteModalOpen(false);
      setTeamToDelete(null);
      fetchTeams();
    }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Teams</h2>
            <button
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={user?.subscriptionStatus !== "active"}
            >
              New Team
            </button>
            <SubscribePlansModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.teamId}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(team.teamId)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setTeamToDelete(team);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Edit Team Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          {teamToEdit && (
            <TeamEditForm
              teamId={teamToEdit.teamId}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteTeamModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setTeamToDelete(null);
        }}
        teamName={teamToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}
