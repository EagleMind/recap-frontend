import { usePinsStore } from "@/store/pinsStore";
import { Pin } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Recap } from "@/types/recap";
import { useTeamStore } from "@/store/teamStore";

interface PinnedRecapsPanelProps {
  onSelect: (recap: Recap) => void;
}

function SortableItem({
  recap,
  onSelect,
  onUnpin,
}: {
  recap: Recap;
  onSelect: (recap: Recap) => void;
  onUnpin: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: recap._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#f9fafb" : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="rounded border border-border bg-card text-card-foreground px-3 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-muted/70 gap-2"
      onClick={() => onSelect(recap)}
    >
      <span
        {...listeners}
        className="mr-2 cursor-grab text-muted-foreground"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </span>
      <span className="truncate max-w-xs flex-1">{recap.title}</span>
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onUnpin(recap._id);
        }}
      >
        Unpin
      </Button>
    </div>
  );
}

export function PinnedRecapsPanel({ onSelect }: PinnedRecapsPanelProps) {
  const { pinnedRecaps, fetchPins, unpinRecap, reorderPins } = usePinsStore();
  const activeTeam = useTeamStore((state) => state.activeTeam);
  const [items, setItems] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (activeTeam) {
      fetchPins(activeTeam.teamId);
    }
  }, [activeTeam, fetchPins]);

  useEffect(() => {
    setItems(pinnedRecaps.map((r) => r._id));
  }, [pinnedRecaps]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over?.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      reorderPins(newItems);
    }
  };

  if (pinnedRecaps.length === 0) {
    return (
      <aside className="w-64 p-4 text-sidebar-foreground h-full flex flex-col gap-2 items-center justify-center">
        <Pin size={28} className="opacity-40 mb-2" />
        <div className="text-center text-muted-foreground text-sm">
          No pinned recaps yet.
          <br />
          <span className="text-xs">
            Pin your favorite recaps for quick access!
          </span>
        </div>
      </aside>
    );
  }
  return (
    <aside className="w-64 p-4 text-sidebar-foreground h-full flex flex-col gap-2">
      <span className="flex items-center gap-2">
        <Pin size={18} /> <div className="font-semibold ">Pinned Recaps</div>
      </span>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((id) => {
              const recap = pinnedRecaps.find((r) => r._id === id);
              if (!recap) return null;
              return (
                <SortableItem
                  key={recap._id}
                  recap={recap}
                  onSelect={onSelect}
                  onUnpin={unpinRecap}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </aside>
  );
}
