import { Post } from "../types/post";
import { cn } from "../lib/utils";

interface CalendarGridProps {
  month: Date; // first day of the displayed month
  postsByDate: Map<string, Post>;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeeks(month: Date): Date[][] {
  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1);
  const lastDay = new Date(year, mon + 1, 0);

  // Start from Sunday of the week containing the 1st
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const weeks: Date[][] = [];
  const cur = new Date(start);

  while (
    cur <= lastDay ||
    weeks.length === 0 ||
    weeks[weeks.length - 1].length % 7 !== 0
  ) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }
  return weeks;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export function CalendarGrid({
  month,
  postsByDate,
  selectedDate,
  onDateClick,
}: CalendarGridProps) {
  const weeks = buildWeeks(month);
  const currentMonth = month.getMonth();

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
      {/* Weekday header row */}
      <div className="grid grid-cols-7 border-b border-border/30 shrink-0">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center h-8 text-[11px] font-medium text-muted-foreground/60 tracking-wide uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks — fill all remaining vertical space */}
      <div
        className="flex-1 grid min-h-0"
        style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}
      >
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 min-h-0">
            {week.map((day, di) => {
              const key = toKey(day);
              const post = postsByDate.get(key);
              const isCurrentMonth = day.getMonth() === currentMonth;
              const isSelected = selectedDate
                ? toKey(selectedDate) === key
                : false;
              const isToday = day.getTime() === today.getTime();

              return (
                <div
                  key={di}
                  onClick={() => onDateClick(day)}
                  className={cn(
                    "relative flex flex-col p-2 border-r border-b border-border/20 cursor-pointer select-none",
                    "group overflow-hidden",
                    isCurrentMonth
                      ? "hover:bg-accent/20"
                      : "opacity-25 pointer-events-none",
                    isSelected &&
                      "bg-primary/15 border-primary/30 hover:bg-primary/20",
                    isToday && !isSelected && "bg-accent/10",
                    // last column: no right border
                    di === 6 && "border-r-0",
                    // last row: no bottom border
                    wi === weeks.length - 1 && "border-b-0",
                  )}
                >
                  {/* Date number */}
                  <span
                    className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium shrink-0",
                      isToday
                        ? "text-white font-semibold"
                        : isSelected
                          ? "text-primary font-semibold"
                          : "text-foreground/80",
                    )}
                    style={isToday ? { backgroundColor: "#FF3B30" } : undefined}
                  >
                    {day.getDate()}
                  </span>

                  {/* Post indicator: colored pill with bucket name */}
                  {post && (
                    <div className="mt-1.5 px-0.5">
                      <span
                        className={cn(
                          "flex items-center gap-1 w-full truncate text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                          post.format_type === "carousel"
                            ? "bg-orange-500/15 text-orange-300"
                            : "bg-blue-500/15 text-blue-300",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full shrink-0",
                            post.format_type === "carousel"
                              ? "bg-orange-400"
                              : "bg-blue-400",
                          )}
                        />
                        <span className="truncate">{post.content_bucket}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
