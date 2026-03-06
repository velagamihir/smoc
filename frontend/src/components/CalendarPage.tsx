import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDownIcon,
  LogOutIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarGrid } from "../components/CalendarGrid";
import { SidePane } from "../components/SidePane";
import { ChatBot } from "../components/ChatBot";
import { Button } from "../components/ui/button";
import { getPosts } from "../lib/api";
import { Post } from "../types/post";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

const FETCH_MONTHS = [
  { month: 2, year: 2026 },
  { month: 3, year: 2026 },
];

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTH_LABELS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarPage() {
  const {
    profile,
    managerClients,
    activeBrandId,
    setActiveBrandId,
    loading,
    signOut,
  } = useAuth();
  const navigate = useNavigate();
  const time = new Date();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(time);
  const [clientDropOpen, setClientDropOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !profile) navigate("/login");
  }, [loading, profile, navigate]);

  const fetchPosts = useCallback(async () => {
    if (!activeBrandId) return;
    const results = await Promise.all(
      FETCH_MONTHS.map(({ month, year }) =>
        getPosts(activeBrandId, month, year),
      ),
    );
    setPosts(results.flat());
  }, [activeBrandId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const postsByDate = new Map<string, Post>();

  posts.forEach((p) => {
    const date = new Date(p.post_date);
    const dateKey = toLocalDateStr(date);
    postsByDate.set(dateKey, p);
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedPost(postsByDate.get(toLocalDateStr(date)) ?? null);
  };

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPost(updated);
  };

  useEffect(() => {
    if (selectedDate)
      setSelectedPost(postsByDate.get(toLocalDateStr(selectedDate)) ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const prevMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const paneOpen = selectedDate !== null;

  const scheduledCount = posts.filter((p) =>
    p.post_date.startsWith(
      `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`,
    ),
  ).length;

  // Active client label for manager dropdown
  const activeClient = managerClients.find((c) => c.brand_id === activeBrandId);
  const activeBrandName =
    activeClient?.brand?.name ?? profile?.full_name ?? "Calendar";

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Calendar panel ── */}
      <div
        className={`flex flex-col min-w-0 transition-[flex,width] duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${paneOpen ? "flex-1" : "w-full"}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-4">
            {/* SMOC wordmark */}
            <span className="text-sm font-bold tracking-tight">SMOC</span>

            {/* Client selector — always visible, only clickable if multiple clients */}
            <div className="relative pl-4 border-l border-border/40">
              {profile.role === "manager" ? (
                <>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Client
                  </div>
                  {managerClients.length > 1 ? (
                    <button
                      onClick={() => setClientDropOpen((v) => !v)}
                      className="flex items-center gap-1 text-sm font-semibold hover:text-foreground/80 transition-colors"
                    >
                      {activeBrandName}
                      <ChevronDownIcon className="size-3.5 text-muted-foreground" />
                    </button>
                  ) : (
                    <span className="text-sm font-semibold">
                      {activeBrandName}
                    </span>
                  )}
                  {clientDropOpen && (
                    <div className="absolute top-10 left-0 z-50 min-w-[180px] rounded-xl border border-border/40 bg-background shadow-xl overflow-hidden">
                      {managerClients.map((mc) => (
                        <button
                          key={mc.brand_id}
                          onClick={() => {
                            setActiveBrandId(mc.brand_id);
                            setClientDropOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-sm hover:bg-accent/30 transition-colors",
                            mc.brand_id === activeBrandId &&
                              "text-violet-400 font-medium",
                          )}
                        >
                          {mc.brand?.name}
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            {mc.client_profile?.full_name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Client view: just show their own brand */
                <span className="text-sm font-semibold">{activeBrandName}</span>
              )}
            </div>

            {/* Month nav */}
            <div className="flex items-center gap-1 pl-4 border-l border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMonth}
                className="h-7 w-7"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-semibold w-40 text-center">
                {MONTH_LABELS[currentMonth.getMonth() + 1]}{" "}
                {currentMonth.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="h-7 w-7"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Right: legend + user + logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-orange-400 inline-block" />{" "}
                Carousel
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-400 inline-block" />{" "}
                Static
              </span>
              <span className="pl-3 border-l border-border/40">
                {scheduledCount} post{scheduledCount !== 1 ? "s" : ""} this
                month
              </span>
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-2 pl-3 border-l border-border/40">
              <div className="text-right">
                <div className="text-[11px] font-medium leading-none">
                  {profile.full_name}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
                  {profile.role}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-7 w-7"
                title="Sign out"
              >
                <LogOutIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Calendar */}
        <main className="flex-1 flex flex-col min-h-0">
          <CalendarGrid
            month={currentMonth}
            postsByDate={postsByDate}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
        </main>
      </div>

      {/* ── Side pane ── */}
      <AnimatePresence>
        {paneOpen && (
          <motion.div
            key="side-pane"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="w-[380px] shrink-0 h-full overflow-hidden border-l border-border/40"
          >
            <SidePane
              selectedDate={selectedDate}
              post={selectedPost}
              onClose={() => setSelectedDate(null)}
              onPostCreated={fetchPosts}
              onPostUpdated={handlePostUpdated}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatBot />
    </div>
  );
}
