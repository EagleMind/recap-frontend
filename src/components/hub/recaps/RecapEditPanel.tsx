import * as React from "react";
import { Button } from "@/components/ui/button";
import { Recap } from "@/types/recap";

interface RecapEditPanelProps {
  recap: Recap;
  onSave?: (recap: Recap) => void;
  onCancel?: () => void;
  mode?: 'view' | 'edit' | 'create';
  members?: { userId: string; name: string; email: string }[];
  membersLoading?: boolean;
}

import { useRecapsStore } from "@/store/recapsStore";

export function RecapEditPanel({ recap, onSave, onCancel, mode = 'edit', members, membersLoading }: RecapEditPanelProps) {
  const [form, setForm] = React.useState({ ...recap });
  const isView = mode === 'view';
  const isCreate = mode === 'create';
  const { loading, error, success, clearError, clearSuccess } = useRecapsStore();
  const [localSuccess, setLocalSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && success) {
      setLocalSuccess(success);
      setTimeout(() => {
        setLocalSuccess(null);
        if (onCancel) onCancel();
        clearSuccess();
      }, 1200);
    }
  }, [success, loading, onCancel, clearSuccess]);

  React.useEffect(() => {
    if (!loading && error) {
      setTimeout(() => {
        clearError();
      }, 2000);
    }
  }, [error, loading, clearError]);

  React.useEffect(() => {
    setForm({ ...recap });
  }, [recap]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (onSave) onSave(form as Recap);
  };

  return (
    <aside className="w-80 p-6 border-l border-border bg-background h-full flex flex-col">
      {/* Add Pin button in view mode */}

      {localSuccess && (
        <div className="mb-3 text-green-600 bg-green-100 border border-green-300 rounded px-2 py-1 text-sm text-center">{localSuccess}</div>
      )}
      {error && (
        <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded px-2 py-1 text-sm text-center">{error}</div>
      )}
      <label className="text-xs font-semibold ">Title</label>
      {isView ? (
        <div className="mb-2">{recap.title}</div>
      ) : (
        <input
          className="mb-2 px-2 py-1 border rounded"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      )}
      <label className="text-xs font-semibold mb-1">Description</label>
      {isView ? (
        <div className="mb-2">{recap.description}</div>
      ) : (
        <textarea
          className="mb-2 px-2 py-1 border rounded"
          name="description"
          value={form.description || ''}
          onChange={handleChange}
        />
      )}
      <label className="text-xs font-semibold mb-1">Assigned To</label>
      {isView ? (
        <div className="mb-2">{recap.assignedTo}</div>
      ) : members ? (
        <select
          className="mb-2 px-2 py-1 border rounded bg-white"
          name="assignedTo"
          value={form.assignedTo}
          onChange={e => setForm({ ...form, assignedTo: e.target.value })}
          disabled={membersLoading}
        >
          <option value="">Select member</option>
          {members && members.map(m => (
            <option key={m.userId} value={m.name}>{m.name} ({m.email})</option>
          ))}
        </select>
      ) : (
        <input
          className="mb-2 px-2 py-1 border rounded"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
        />
      )}
      {!isView && (
        <div className="flex gap-2 mt-auto">
          <Button variant="default" size="sm" onClick={handleSave} disabled={loading}>
            {isCreate ? 'Create' : 'Save'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>Cancel</Button>
        </div>
      )}
    </aside>
  );
}
