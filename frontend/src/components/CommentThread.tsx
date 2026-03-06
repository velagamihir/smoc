import { useEffect, useRef, useState } from "react";
import { MessageCircleIcon, SendIcon, XIcon } from "lucide-react";
import { Comment, FieldName } from "../types/comment";
import { getComments, createComment } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

interface CommentThreadProps {
  postId: string;
  fieldName: FieldName;
  fieldLabel: string;
  commentCount: number;
  onCountChange: (delta: number) => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Avatar({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={cn(
        "size-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
        role === "manager"
          ? "bg-violet-500/30 text-violet-300"
          : "bg-amber-500/20 text-amber-300",
      )}
    >
      {initials}
    </div>
  );
}

export function CommentThread({
  postId,
  fieldName,
  fieldLabel,
  commentCount,
  onCountChange,
}: CommentThreadProps) {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getComments(postId, fieldName)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [open, postId, fieldName]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments, open]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const newComment = await createComment({
        post_id: postId,
        field_name: fieldName,
        content: trimmed,
      });
      setComments((prev) => [...prev, newComment]);
      setText("");
      onCountChange(1);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
          open
            ? "bg-violet-500/20 text-violet-300"
            : "bg-transparent text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent/30",
        )}
      >
        <MessageCircleIcon className="size-3" />
        {commentCount > 0 && <span>{commentCount}</span>}
      </button>

      {/* Thread popover */}
      {open && (
        <div
          className="absolute right-0 top-7 z-50 w-80 rounded-2xl border border-border/40 bg-background shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "420px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 shrink-0">
            <p className="text-xs font-semibold text-foreground">
              {fieldLabel}
            </p>
            <button onClick={() => setOpen(false)}>
              <XIcon className="size-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
            {loading && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Loading…
              </p>
            )}
            {!loading && comments.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                No comments yet. Start the conversation.
              </p>
            )}
            {comments.map((c) => {
              const name = c.profile?.full_name ?? "Unknown";
              const role = c.profile?.role ?? "client";
              const isMe = c.user_id === profile?.id;
              return (
                <div
                  key={c.id}
                  className={cn("flex gap-2.5", isMe && "flex-row-reverse")}
                >
                  <Avatar name={name} role={role} />
                  <div
                    className={cn(
                      "flex flex-col gap-0.5 max-w-[75%]",
                      isMe && "items-end",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-foreground/70">
                        {name}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                          role === "manager"
                            ? "bg-violet-500/15 text-violet-400"
                            : "bg-amber-500/15 text-amber-400",
                        )}
                      >
                        {role}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "text-xs leading-relaxed px-3 py-2 rounded-2xl",
                        isMe
                          ? "bg-violet-500/20 text-foreground rounded-tr-sm"
                          : "bg-accent/40 text-foreground rounded-tl-sm",
                      )}
                    >
                      {c.content}
                    </div>
                    <span className="text-[9px] text-muted-foreground/50">
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/30 shrink-0">
            <div className="flex items-end gap-2">
              {profile && (
                <Avatar name={profile.full_name} role={profile.role} />
              )}
              <div className="flex-1 rounded-xl border border-border/40 bg-accent/20 px-3 py-2 flex items-center gap-2">
                <textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Add a comment…"
                  className="flex-1 bg-transparent text-xs resize-none focus:outline-none leading-relaxed"
                  style={{ maxHeight: "80px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="text-violet-400 hover:text-violet-300 disabled:opacity-30 shrink-0"
                >
                  <SendIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
