import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Team } from "@/types/team";

interface TeamFormProps {
  initial?: Partial<Team>;
  onSubmit: (team: Partial<Team>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TeamForm({ initial = {}, onSubmit, onCancel, loading }: TeamFormProps) {
  const [name, setName] = React.useState(initial.name || "");
  const [description, setDescription] = React.useState(initial.description || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...initial, name, description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Team Name</label>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter team name"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
