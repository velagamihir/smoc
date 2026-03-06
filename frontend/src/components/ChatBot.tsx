import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BotMessageSquare, SendIcon, XIcon, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

const BASE = "http://localhost:8000";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function timeStr() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatBot() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<(Message & { time: string })[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your calendar assistant. Ask me anything about the Pushpakshi content schedule — posts, dates, captions, formats, and more.",
      time: timeStr(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, time: timeStr() },
    ]);
    setLoading(true);

    try {
      const raw = localStorage.getItem("calendar_session");
      const token = raw ? JSON.parse(raw)?.token : null;

      const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply = res.ok
        ? (data.reply ?? "No response.")
        : (data.detail ?? "Error from server.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, time: timeStr() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Could not reach the server.",
          time: timeStr(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="w-[360px] rounded-2xl border border-border/40 bg-background shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <BotMessageSquare className="size-3.5 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none">SMOC AI</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Ask about any post
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={i}
                    className={cn("flex gap-2.5", isUser && "flex-row-reverse")}
                  >
                    {/* Avatar */}
                    {!isUser && (
                      <div className="size-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <BotMessageSquare className="size-3 text-violet-400" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex flex-col gap-0.5 max-w-[80%]",
                        isUser && "items-end",
                      )}
                    >
                      <div
                        className={cn(
                          "text-xs leading-relaxed px-3 py-2 rounded-2xl",
                          isUser
                            ? "bg-violet-500/20 text-foreground rounded-tr-sm whitespace-pre-wrap"
                            : "bg-accent/40 text-foreground rounded-tl-sm",
                        )}
                      >
                        {isUser ? (
                          msg.content
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-1 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-4 mb-1 space-y-0.5">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-4 mb-1 space-y-0.5">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-xs">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-foreground">
                                  {children}
                                </strong>
                              ),
                              code: ({ children }) => (
                                <code className="bg-black/20 px-1 rounded text-[10px]">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground/50">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="size-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <BotMessageSquare className="size-3 text-violet-400" />
                  </div>
                  <div className="bg-accent/40 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                    <Loader2 className="size-3 text-muted-foreground animate-spin" />
                    <span className="text-[10px] text-muted-foreground">
                      Thinking…
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border/30 shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex-1 rounded-xl border border-border/40 bg-accent/20 px-3 py-2 flex items-center gap-2">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Ask about the calendar…"
                    className="flex-1 bg-transparent text-xs resize-none focus:outline-none leading-relaxed"
                    style={{ maxHeight: "80px" }}
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || loading}
                    className="text-violet-400 hover:text-violet-300 disabled:opacity-30 shrink-0 transition-colors"
                  >
                    <SendIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "size-12 rounded-full flex items-center justify-center shadow-xl transition-colors",
          open
            ? "bg-accent border border-border/40 text-muted-foreground"
            : "bg-violet-600 hover:bg-violet-500 text-white",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <XIcon className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BotMessageSquare className="size-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
