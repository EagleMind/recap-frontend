import * as React from "react";
import type { Recap } from "@/types/recap";
import { useRecapsStore } from "@/store/recapsStore";
import { useTeamStore } from "@/store/teamStore";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { RecapDeleteConfirm } from "./RecapDeleteConfirm";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import moment from "moment";

import { MiniCalendar } from "./MiniCalendar";
import { ActivityFeed } from "./ActivityFeed";
import { PinnedRecapsPanel } from "./PinnedRecapsPanel";
import { Dialog, DialogContent, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { VisuallyHidden } from "./VisuallyHidden";
import { RecapEditPanel } from "./RecapEditPanel";
import RecapCard from "./recapCard";
import { PinSidebarToggle } from "./PinSidebarToggle";
import { CalendarSidebarToggle } from "./CalendarSidebarToggle";

function formatDate(dateStr: string) {
  return moment(dateStr).format('LLL');
}

export default function RecapsPage() {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editRecap, setEditRecap] = React.useState<any | null>(null);
  const [deleteRecap, setDeleteRecap] = React.useState<any | null>(null);
  const [selectedRecap, setSelectedRecap] = React.useState<any | null>(null);

  const { recapsByDate, fetchRecaps, createRecap, updateRecap } = useRecapsStore();
  const members = useTeamStore(state => state.members);
  const fetchMembers = useTeamStore(state => state.fetchMembers);
  const membersLoading = useTeamStore(state => state.isLoading);

  // Fetch members when dialog opens
  React.useEffect(() => {
    if ((createOpen || !!selectedRecap) && members.length === 0 && !membersLoading) {
      fetchMembers();
    }
  }, [createOpen, selectedRecap, members.length, membersLoading, fetchMembers]);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  // Pin sidebar toggle
  const [pinSidebarOpen, setPinSidebarOpen] = React.useState(false);
  // Calendar sidebar toggle
  const [calendarSidebarOpen, setCalendarSidebarOpen] = React.useState(false);
  // Mock activity feed for demo

  React.useEffect(() => {
    fetchRecaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Sort dates descending
  const sortedDates = React.useMemo(() => Object.keys(recapsByDate).sort((a, b) => b.localeCompare(a)), [recapsByDate]);
  const allRecaps = React.useMemo(() => Object.values(recapsByDate).flat(), [recapsByDate]);
  const availableDates = sortedDates;

  // Memoized filtered recaps by selectedDate
  const filteredDates = React.useMemo(() => {
    if (selectedDate && recapsByDate[selectedDate]) {
      return [selectedDate];
    }
    return sortedDates;
  }, [selectedDate, sortedDates, recapsByDate]);

  // Activity feed: show 'created' or 'updated' based on timestamps
  const activities = React.useMemo(() =>
    allRecaps.map(r => {
      const isCreated = r.createdAt === r.updatedAt;
      return {
        id: r._id,
        type: isCreated ? "created" : "updated",
        user: isCreated ? (r as any).createdBy ?? r.assignedTo ?? "Unknown" : r.assignedTo ?? (r as any).createdBy ?? "Unknown",
        recapTitle: r.title,
        date: (isCreated ? r.createdAt : r.updatedAt) || r.createdAt || r.updatedAt || "",
        message: r.description,
      };
    }), [allRecaps]);

  const handleSelectRecap = (recap: any) => setSelectedRecap(recap);

  // Timeline click handlers
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setCalendarSidebarOpen(false);
    // Optionally scroll timeline to this date
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* Left sidebar: MiniCalendar + ActivityFeed */}
      <aside className="hidden md:flex flex-col min-w-[19rem] border-r border-border bg-background py-6 gap-4">
        <MiniCalendar selectedDate={selectedDate} onSelectDate={handleSelectDate} availableDates={availableDates} />
        <ActivityFeed activities={activities} />
      </aside>

      {/* Timeline Main Area */}
      <main className="flex-1 flex flex-col items-center justify-start overflow-y-auto bg-background hide-scrollbar">
        <div className="w-full max-w-3xl px-8 py-6">
          {/* Add Recap button at the top */}
          <div className="sticky top-4 z-30 flex justify-center items-center mb-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="pointer-events-auto"
              onClick={() => setCreateOpen(true)}
              aria-label="Add Recap"
              style={{ minWidth: 120 }}
            >
              <Plus className="w-4 h-4" />
              Add Recap
            </Button>
            <CalendarSidebarToggle open={calendarSidebarOpen} onToggle={() => {
              setCalendarSidebarOpen((v) => !v);
              if (!calendarSidebarOpen) setPinSidebarOpen(false);
            }} />
            <PinSidebarToggle open={pinSidebarOpen} onToggle={() => {
              setPinSidebarOpen((v) => !v);
              if (!pinSidebarOpen) setCalendarSidebarOpen(false);
            }} />
          </div>

          {/* Add Recap Dialog */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogOverlay className="bg-black/30 backdrop-blur-sm transition-opacity duration-300" />
            <DialogContent className="w-[80vw] h-[80vh] p-0">
              <DialogTitle className="px-6 pt-6 pb-2">Add Recap</DialogTitle>
              <RecapEditPanel
                mode="create"
                recap={{ title: '', description: '', assignedTo: '', team: '', pinned: null } as any}
                members={members}
                membersLoading={membersLoading}
                onSave={async (recap) => {
                  await createRecap(recap);
                  setCreateOpen(false);
                }}
                onCancel={() => setCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* View/Edit Recap Dialog */}
          <Dialog open={!!selectedRecap} onOpenChange={open => { if (!open) setSelectedRecap(null); }}>
            <DialogOverlay className=" backdrop-blur-sm transition-opacity duration-300" />
            <DialogContent className="w-[80vw] h-[80vh] p-0">
              <DialogTitle className="px-6 pt-6 pb-2">
                {selectedRecap?._mode === 'edit' ? 'Edit Recap' : 'View Recap'}
              </DialogTitle>
              {selectedRecap && (
                <RecapEditPanel
                  mode={selectedRecap._mode || 'view'}
                  recap={selectedRecap}
                  members={members}
                  membersLoading={membersLoading}
                  onSave={selectedRecap._mode === 'edit' ? async (recap) => {
                    await updateRecap(recap._id, recap);
                    setSelectedRecap(null);
                  } : undefined}
                  onCancel={() => setSelectedRecap(null)}
                />
              )}
            </DialogContent>
          </Dialog>
          {filteredDates.map((date) => {
            const recaps: Recap[] = recapsByDate[date];
            const isOpen = openSections[date] !== false;
            const handleToggle = () => {
              setOpenSections(prev => ({ ...prev, [date]: !isOpen }));
            };
            return (
              <div key={date} className="mb-8">
                <Collapsible open={isOpen} onOpenChange={handleToggle}>
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-card rounded px-4 py-2 font-semibold text-lg mb-2 border border-border focus:outline-none transition-colors">
                      <span>
                        {formatDate(date)}
                        <span className="ml-2 text-xs font-normal bg-muted rounded-full px-2 py-0.5 text-muted-foreground">
                          {recaps.length} recaps
                        </span>
                      </span>
                      <span className="ml-2">{isOpen ? <ChevronDown /> : <ChevronUp></ChevronUp>}</span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className={recaps.length > 3 ? "max-h-96 overflow-y-auto pr-2" : undefined}>
                      {recaps.map((recap: Recap) => (
                        <RecapCard
                          recap={recap}
                          key={recap._id}
                          onView={() => {
                            setSelectedRecap({ ...recap, _mode: 'view' });
                            setEditOpen(false);
                          }}
                          onEdit={() => {
                            setSelectedRecap({ ...recap, _mode: 'edit' });
                            setEditOpen(true);
                          }}
                          onDelete={() => { setDeleteRecap(recap); setDeleteOpen(true); }}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>

        {deleteOpen && deleteRecap && (
          <RecapDeleteConfirm
            open={deleteOpen}
            onOpenChange={open => {
              if (!open) {
                setDeleteOpen(false);
                setDeleteRecap(null);
              }
            }}
            recapId={deleteRecap._id}
            recapTitle={deleteRecap.title}
          />
        )}
      </main>

      {/* Right sidebar: Pinned Recaps (desktop only, hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-80 min-w-[19rem] border-l border-border bg-background h-full py-6 px-3 hide-scrollbar">
        <PinnedRecapsPanel onSelect={handleSelectRecap} />
      </aside>
      {/* Floating Calendar Sidebar Overlay (all screens) */}
      <div className={
        calendarSidebarOpen
          ? "fixed inset-0 z-50 flex justify-end pointer-events-auto"
          : "fixed inset-0 z-50 flex justify-end pointer-events-none"
      } aria-hidden={!calendarSidebarOpen}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${calendarSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setCalendarSidebarOpen(false)}
          aria-label="Close calendar sidebar"
        />
        {/* Sidebar */}
        <aside
          className={`relative w-80 max-w-full h-full bg-background border-l border-border shadow-2xl p-4 overflow-y-auto transform transition-all duration-300 ease-in-out ${calendarSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
          tabIndex={-1}
        >
          <MiniCalendar selectedDate={selectedDate} onSelectDate={handleSelectDate} availableDates={availableDates} />
        </aside>
      </div>
      {/* Floating Pin Sidebar Overlay (all screens) */}
      <div className={
        pinSidebarOpen
          ? "fixed inset-0 z-50 flex justify-end pointer-events-auto"
          : "fixed inset-0 z-50 flex justify-end pointer-events-none"
      } aria-hidden={!pinSidebarOpen}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${pinSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setPinSidebarOpen(false)}
          aria-label="Close pinned recaps sidebar"
        />
        {/* Sidebar */}
        <aside
          className={`relative w-80 max-w-full h-full bg-background border-l border-border shadow-2xl p-4 overflow-y-auto transform transition-all duration-300 ease-in-out ${pinSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
          tabIndex={-1}
        >
          <PinnedRecapsPanel onSelect={handleSelectRecap} />
        </aside>
      </div>

      {/* Recap Edit Dialog */}
      <Dialog open={!!editRecap} onOpenChange={open => { if (!open) setEditRecap(null); }}>
        <DialogOverlay className="backdrop-blur-sm bg-black/30" />
        <DialogContent className="w-[80vw] h-[80vh] p-0" aria-describedby="recap-edit-desc">
          <DialogTitle className="sr-only">Edit Recap</DialogTitle>
          <VisuallyHidden><span id="recap-edit-desc">Edit the selected recap.</span></VisuallyHidden>
          {editRecap && (
            <RecapEditPanel
              recap={editRecap}
              onSave={(updated: any) => {
                setSelectedRecap(updated);
                setEditRecap(null);
                // Optionally update the recaps list here
              }}
              onCancel={() => setEditRecap(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {deleteOpen && deleteRecap && (
        <RecapDeleteConfirm
          open={deleteOpen}
          onOpenChange={open => {
            if (!open) {
              setDeleteOpen(false);
              setDeleteRecap(null);
            }
          }}
          recapId={deleteRecap._id}
          recapTitle={deleteRecap.title}
        />
      )}
    </div>
  );
}
