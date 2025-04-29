
interface ActivityFeedProps {
  activities: { id: string; type: string; user: string; recapTitle: string; date: string; message?: string }[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <aside className="w-72 h-full flex flex-col gap-2 overflow-y-auto hide-scrollbar">
      <div className="font-semibold mb-2">Activity Feed</div>
      <div className="flex flex-col gap-2">
        {activities.length === 0 && <div className="text-muted-foreground text-sm">No recent activity</div>}
        {activities.map(act => {
          let icon = null;
          let highlight = "";
          let actionText = act.type;
          if (act.type === "created") {
            highlight = "text-green-700";
            icon = <span className="mr-1">🟢</span>;
          } else if (act.type === "updated") {
            highlight = "text-blue-700";
            icon = <span className="mr-1">🔵</span>;
          } else {
            highlight = "text-muted-foreground";
            icon = <span className="mr-1">ℹ️</span>;
          }

          return (
            <div key={act.id} className={`rounded bg-card px-3 py-2 text-xs border  flex flex-col`}>
              <div className="flex items-center mb-1">
                {icon}
                <span className={`font-medium mr-1 ${highlight}`}>{act.user}</span>
                <span className={`mr-1 ${highlight}`}>{actionText}</span>
                <span className="font-semibold">{act.recapTitle}</span>
              </div>
              {act.message && <div className="text-muted-foreground mt-1">{act.message}</div>}
              <div className="text-muted-foreground mt-1 text-[10px]">{new Date(act.date).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
