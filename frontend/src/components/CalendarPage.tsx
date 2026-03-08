import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDownIcon,
  LogOutIcon,
  UserPlus,
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

  const isManager = profile?.role === "manager";

  // Auth guard
  useEffect(() => {
    if (!loading && !profile) navigate("/login");
  }, [loading, profile, navigate]);

  // Auto select first client
  useEffect(() => {
    if (
      profile?.role === "manager" &&
      managerClients.length > 0 &&
      !activeBrandId
    ) {
      setActiveBrandId(managerClients[0].client_id);
    }
  }, [profile?.role, managerClients, activeBrandId, setActiveBrandId]);

  const fetchPosts = useCallback(async () => {
    if (isManager && managerClients.length === 0) return;

    const clientId = isManager ? activeBrandId : profile?.id;
    if (!clientId) return;

    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();

    try {
      const results = await getPosts(clientId, month, year);
      setPosts(results);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, [
    isManager,
    managerClients.length,
    activeBrandId,
    profile?.id,
    currentMonth,
  ]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const postsByDate = new Map<string, Post>();

  posts.forEach((p) => {
    const d = new Date(p.post_date);

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;

    postsByDate.set(key, p);
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

  const activeClient = managerClients.find(
    (c) => c.client_id === activeBrandId,
  );

  const activeBrandName =
    managerClients.length === 0
      ? "No clients"
      : (activeClient?.client_profile?.full_name ??
        managerClients[0]?.client_profile?.full_name ??
        "Client");

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div
        className={`flex flex-col min-w-0 transition-[flex,width] duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${paneOpen ? "flex-1" : "w-full"}`}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold tracking-tight">SMOC</span>

            {/* CLIENT SELECTOR */}
            <div className="relative pl-4 border-l border-border/40">
              {profile.role === "manager" ? (
                <>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Client
                  </div>

                  {managerClients.length === 0 && (
                    <span className="text-sm font-semibold text-muted-foreground">
                      No clients
                    </span>
                  )}

                  {managerClients.length === 1 && (
                    <span className="text-sm font-semibold">
                      {managerClients[0]?.client_profile?.full_name}
                    </span>
                  )}

                  {managerClients.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setClientDropOpen((v) => !v);
                        }}
                        className="flex items-center gap-1 text-sm font-semibold hover:text-foreground/80 transition-colors"
                      >
                        {activeBrandName}
                        <ChevronDownIcon className="size-3.5 text-muted-foreground" />
                      </button>

                      {clientDropOpen && (
                        <div className="absolute top-10 left-0 z-50 min-w-[180px] rounded-xl border border-border/40 bg-background shadow-xl overflow-hidden">
                          {managerClients.map((mc) => (
                            <button
                              key={mc.client_id}
                              onClick={() => {
                                setActiveBrandId(mc.client_id);
                                setClientDropOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 text-sm hover:bg-accent/30 transition-colors",
                                mc.client_id === activeBrandId &&
                                  "text-violet-400 font-medium",
                              )}
                            >
                              {mc.client_profile?.full_name}
                              <span className="block text-[10px] text-muted-foreground font-normal">
                                {mc.client_profile?.email}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <span className="text-sm font-semibold">{activeBrandName}</span>
              )}
            </div>

            {/* MONTH NAV */}
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

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-orange-400 inline-block" />
                Carousel
              </span>

              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-400 inline-block" />
                Static
              </span>

              <span className="pl-3 border-l border-border/40">
                {scheduledCount} post{scheduledCount !== 1 ? "s" : ""} this
                month
              </span>
            </div>

            {profile.role === "manager" && (
              <Button
                onClick={() => navigate("/manager/create-client")}
                className="h-7 px-3 text-xs flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
              >
                <UserPlus className="size-3.5" />
                Create Client
              </Button>
            )}

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
              >
                <LogOutIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </header>

        {/* CALENDAR */}
        <main className="flex-1 flex flex-col min-h-0">
          <CalendarGrid
            month={currentMonth}
            postsByDate={postsByDate}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
        </main>
      </div>

      {/* SIDE PANE */}
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
