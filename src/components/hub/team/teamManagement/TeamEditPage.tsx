import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamStore } from "@/store/teamStore";
import { TeamForm } from "./TeamForm";
import { Button } from "@/components/ui/button";
import type { Team } from "@/types/team";

export default function TeamEditPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const teams = useTeamStore((state) => state.teams);
  const updateTeam = useTeamStore((state) => state.updateTeam);
  const isLoading = useTeamStore((state) => state.isLoading);
  const error = useTeamStore((state) => state.error);

  const team = teams.find((t) => t.teamId === teamId);

  async function handleSubmit(data: Partial<Team>) {
    if (!team) return;
    await updateTeam(team.teamId, data);
    navigate("/hub/team/manage");
  }

  function handleCancel() {
    navigate("/hub/team/manage");
  }

  if (!team) {
    return <div className="p-6">Team not found.</div>;
  }

  return (
    <div className="p-6 w-full">

      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="w-full">
        <TeamForm
          initial={team}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
