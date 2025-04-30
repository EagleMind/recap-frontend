
interface ActivityFeedProps {
  activities: { id: string; type: string; user: string; recapTitle: string; date: string; message?: string }[];
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
export function ActivityFeed({ activities }: ActivityFeedProps) {

  return (
    <aside className="w-72 h-full flex flex-col gap-2 overflow-y-auto hide-scrollbar">
      <div className="font-semibold mb-2">Activity Feed</div>
      <div className="flex flex-col gap-2">
        {activities.length === 0 && <div className="text-muted-foreground text-sm">No recent activity</div>}
        {activities.map(act => {
          let highlight = "";
          let actionText = act.type;

          let messageHtml = "";
          if (act.message) {
            try {
              const blocks = JSON.parse(act.message);
              messageHtml = blockNoteBlocksToHTML(blocks);
            } catch {
              messageHtml = act.message;
            }
          }

          return (
            <div key={act.id} className="rounded border p-2 bg-card">
              <div className="flex items-center gap-2">
                <span className={`mr-1 ${highlight}`}>{actionText}</span>
                <span className="font-semibold">{act.recapTitle}</span>
              </div>
              {messageHtml && (
                <div
                  className="mt-3 text-[15px] text-foreground/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: messageHtml }}
                />
              )}
              <div className="text-muted-foreground mt-1 text-[10px]">{new Date(act.date).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
