import { useNavigate } from "react-router-dom";
import { useTeamStore } from "@/store/teamStore";
import { TeamForm } from "./TeamForm";
import type { Team } from "@/types/team";

export default function TeamCreatePage() {
  const createTeam = useTeamStore((state) => state.createTeam);
  const isLoading = useTeamStore((state) => state.isLoading);
  const error = useTeamStore((state) => state.error);
  const navigate = useNavigate();

  async function handleSubmit(data: Partial<Team>) {
    await createTeam(data);
    navigate("/hub/team/manage");
  }

  function handleCancel() {
    navigate("/hub/team/manage");
  }

  return (
    <div className="p-6 w-full">

      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className=" w-full">
        <TeamForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
