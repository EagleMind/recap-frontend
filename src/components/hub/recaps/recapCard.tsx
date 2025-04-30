import type { Recap } from "@/types/recap";

import { Edit, Trash2, User, Calendar, Pin as PinIcon } from "lucide-react";
import { usePinsStore } from "@/store/pinsStore";
import { Button } from "@/components/ui/button";
import moment from "moment";
import React, { useEffect, useState } from "react";

function formatDate(dateStr: string) {
  return moment(dateStr).format('LLL');
}
function blockNoteBlocksToHTML(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p>${block.content?.map(inlineToHTML).join("") ?? ""}</p>`;
        case "heading":
          const level = block.props?.level || 1;
          return `<h${level}>${block.content?.map(inlineToHTML).join("") ?? ""}</h${level}>`;
        case "bulletListItem":
          return `<ul><li>${block.content?.map(inlineToHTML).join("") ?? ""}</li></ul>`;
        case "numberedListItem":
          return `<ol><li>${block.content?.map(inlineToHTML).join("") ?? ""}</li></ol>`;
        // Add more cases as needed for other block types
        default:
          return "";
      }
    })
    .join("");
}

function inlineToHTML(inline: any): string {
  if (!inline) return "";
  let text = inline.text || "";
  if (inline.bold) text = `<strong>${text}</strong>`;
  if (inline.italic) text = `<em>${text}</em>`;
  if (inline.underline) text = `<u>${text}</u>`;
  return text;
}
export default function RecapCard({ recap, onEdit, onDelete, onView }: { recap: Recap; onEdit: () => void; onDelete: () => void; onView: () => void }) {
  const { pinRecap, pinnedRecaps } = usePinsStore();
  const isPinned = pinnedRecaps.some((r: Recap) => r._id === recap._id);
  const [showPinned, setShowPinned] = useState(false);
  const [pinnedVisible, setPinnedVisible] = useState(false);

  // Only trigger animation on explicit pin action, not on mount or isPinned change
  const triggerPinnedAnimation = () => {
    setShowPinned(true);
    setPinnedVisible(true);
    setTimeout(() => setShowPinned(false), 1000);
  };

  let descriptionHtml = "";
  try {
    const blocks = recap.description ? JSON.parse(recap.description) : [];
    descriptionHtml = blockNoteBlocksToHTML(blocks);
  } catch {
    descriptionHtml = recap.description || "";
  }
  useEffect(() => {
    if (!showPinned && pinnedVisible) {
      // Wait for the fade-out transition (300ms), then hide
      const timeout = setTimeout(() => setPinnedVisible(false), 300);
      return () => clearTimeout(timeout);
    }
    if (showPinned) {
      setPinnedVisible(true);
    }
  }, [showPinned, pinnedVisible]);

  return (
    <div
      className="border border-border rounded-lg p-3 md:p-4 mb-4 hover:shadow-md transition-colors relative group cursor-pointer md:flex md:justify-between md:items-start"
      onClick={onView}
      tabIndex={0}
      role="button"
      aria-label={`View recap ${recap.title}`}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-start justify-between gap-3 gap-6 mb-1 w-full">
          <div className="font-semibold text-base text-card-foreground break-words break-normal line-clamp-none flex-1">
            {recap.title}
          </div>
          <div className="flex gap-2 gap-3 items-center justify-end self-start flex-shrink-0">
            <Button
              variant={isPinned ? "secondary" : "outline"}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(); }}
              title="Edit"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant={isPinned ? "secondary" : "outline"}
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDelete(); }}
              title="Delete"
            >
              <Trash2 size={16} />
            </Button>
            {isPinned ? (
              pinnedVisible ? (
                <span
                  className={`text-yellow-500 transition-opacity duration-300 ${showPinned ? 'opacity-100' : 'opacity-0'}`}
                >
                  Pinned!
                </span>
              ) : null
            ) : (
              <Button
                variant="outline"
                size="icon"
                title="Pin"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  pinRecap(recap._id);
                  triggerPinnedAnimation();
                }}
              >
                <PinIcon size={16} />
              </Button>
            )}
          </div>
        </div>
        {/* Meta info and description below title/actions row */}
        <div className="flex flex-col gap-2 text-xs md:text-sm text-muted-foreground">
          <div className="flex flex-col gap-1 md:flex-row md:gap-6">
            <span className="flex items-center gap-1 truncate">
              <User className="inline-block align-middle" size={16} />
              <span className="font-medium">Assigned To:</span> <span className="truncate">{recap.assignedTo}</span>
            </span>
            <span className="flex items-center gap-1 truncate">
              <Calendar className="inline-block align-middle" size={16} />
              <span className="font-medium">Created:</span> <span className="truncate">{formatDate(recap.createdAt)}</span>
            </span>
          </div>
          {recap.description && (
            <div
              className="mt-3 text-[15px] text-foreground/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}