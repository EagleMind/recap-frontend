import * as React from "react";
import { useTeamStore } from "@/store/teamStore";
import { useTeamMemberStore } from "@/store/teamMemberStore";

interface MemberEditFormProps {
  memberId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MemberEditForm({ memberId, onSuccess, onCancel }: MemberEditFormProps) {
  const activeTeam = useTeamStore((state) => state.activeTeam);
  const fetchMember = useTeamMemberStore((state) => state.fetchMember);
  const updateMember = useTeamMemberStore((state) => state.updateMember);
  const member = useTeamMemberStore((state) => state.member);
  const isLoading = useTeamMemberStore((state) => state.loading);
  const error = useTeamMemberStore((state) => state.error);
  const roles = useTeamStore((state) => state.roles);

  React.useEffect(() => {
    if (activeTeam && memberId) {
      fetchMember(activeTeam.teamId, memberId);
    }
  }, [activeTeam, memberId, fetchMember]);

  const [name, setName] = React.useState("");
  const [roleId, setRoleId] = React.useState("");
  React.useEffect(() => {
    if (member) {
      setName(member.user.name || "");
      setRoleId(member.role?._id || "");
    }
  }, [member]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!member || !activeTeam) return;
    await updateMember(activeTeam.teamId, member._id, { name, role: roleId });
    onSuccess();
  }

  if (isLoading && !member) {
    return <div className="p-6">Loading...</div>;
  }
  if (!member) {
    return <div className="p-6">Member not found.</div>;
  }

  return (
    <div className="p-6 w-full max-w-md ">
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            {roles.map((role: any) => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>Save</button>
        </div>
      </form>
    </div>
  );
}
