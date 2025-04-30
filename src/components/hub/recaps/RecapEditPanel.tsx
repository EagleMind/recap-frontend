import * as React from "react";
import { Button } from "@/components/ui/button";
import { Recap } from "@/types/recap";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTeamStore } from "@/store/teamStore";
interface RecapEditPanelProps {
  recap: Partial<Recap>;
  onSave?: (recap: Recap) => void;
  onCancel?: () => void;
  mode?: 'view' | 'edit' | 'create';
  members?: { userId: string; name: string; email: string }[];
  membersLoading?: boolean;
  pinned?: boolean;
}

import { useRecapsStore } from "@/store/recapsStore";

export function RecapEditPanel({ recap, onSave, onCancel, mode = 'edit', members, membersLoading, pinned }: RecapEditPanelProps) {
  const activeTeam = useTeamStore((state) => state.activeTeam);
  console.log("activeTeam", recap, activeTeam?.teamId ?? "");
  const [form, setForm] = React.useState(() => {
    return { ...recap, pinned };
  });
  const isView = mode === 'view';
  const isCreate = mode === 'create';
  const { loading, error, success, clearError, clearSuccess } = useRecapsStore();
  const [localSuccess, setLocalSuccess] = React.useState<string | null>(null);

  let initialContent;
  try {
    initialContent = form.description ? JSON.parse(form.description) : undefined;
  } catch {
    initialContent = undefined;
  }
  const editor = useCreateBlockNote({ initialContent });

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
    if (mode === "create") {
      setForm({ ...recap, team: activeTeam?.teamId ?? "", pinned: pinned });
    } else {
      setForm({ ...recap, pinned: pinned });
    }
  }, [recap]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (onSave) onSave(form as Recap);
  };

  return (
    <aside className="w-full max-w-3xl p-6 bg-background h-full flex flex-col gap-6">
      {/* Status Messages */}
      {localSuccess && (
        <div className="mb-2 text-green-600 bg-green-100 border border-green-300 rounded px-4 py-2 text-sm text-center">
          {localSuccess}
        </div>
      )}
      {error && (
        <div className="mb-2 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 text-sm text-center">
          {error}
        </div>
      )}

      {/* Title Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        {isView ? (
          <div className="text-base">{recap.title}</div>
        ) : (
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Editor Section */}
      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium">Description</label>
        {isView ? (
          <div className="text-base">{recap.description}</div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-background flex-1">
            <BlockNoteView
              editor={editor}
              onChange={() => {
                const content = JSON.stringify(editor.document);
                setForm((prev) => ({ ...prev, description: content }));
              }}
              className="min-h-[300px]"
              theme="light"
            />
          </div>
        )}
      </div>

      {/* Assigned To Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Assigned To</label>
        {isView ? (
          <div className="text-base">{recap.assignedTo}</div>
        ) : members ? (
          <select
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
            name="assignedTo"
            value={form.assignedTo}
            onChange={e => setForm({ ...form, assignedTo: e.target.value })}
            disabled={membersLoading}
          >
            <option value="">{recap.assignedTo}</option>
            {members.map(m => (
              <option key={m.userId} value={m.userId}>{m.name}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Action Buttons */}
      {!isView && (
        <div className="flex gap-3">
          <Button
            className="flex-grow"
            size="default"
            onClick={handleSave}
            disabled={loading}
          >
            {isCreate ? 'Create' : 'Save Changes'}
          </Button>
          <Button
            variant="ghost"
            size="default"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      )}
    </aside>
  );
}