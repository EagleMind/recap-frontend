"use client";



import { useTeamStore } from "@/store/teamStore";
import { TeamPermission } from ".";

export function PermissionsPage() {
  const permissions = useTeamStore((state) => state.permissions);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Team Permissions</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Permission</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission}>
              <td className="px-4 py-2">{permission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
