import { Post } from "../types/post";
import { PostDetail } from "../components/PostDetail";
import { PostForm } from "../components/PostForm";
import { XIcon, CalendarDaysIcon, EyeIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { InstagramPreview } from "./ui/InstagramPreview";
import { SocialPreview } from "./ui/SocialMediaPreview";
interface SidePaneProps {
  selectedDate: Date | null;
  post: Post | null;
  onClose: () => void;
  onPostCreated: () => void;
  onPostUpdated: (updated: Post) => void;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SidePane({
  selectedDate,
  post,
  onClose,
  onPostCreated,
  onPostUpdated,
}: SidePaneProps) {
  const { profile, activeBrandId, managerClients } = useAuth();
  const isManager = profile?.role === "manager";
  const [showPreview, setShowPreview] = useState(false);
  if (!selectedDate) return null;

  return (
    <div className="flex flex-col h-full border-l bg-background">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-4 border-b border-border/40">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <CalendarDaysIcon className="size-3.5" />
            <span>
              {post
                ? "Scheduled Post"
                : isManager
                  ? "New Post"
                  : "No post scheduled"}
            </span>
          </div>
          <h2 className="text-sm font-semibold leading-tight">
            {formatDate(selectedDate)}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {post && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs"
            >
              <EyeIcon className="size-3.5 mr-1" />
              Preview
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 -mr-2 h-8 w-8"
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {post ? (
          <PostDetail post={post} onPostUpdated={onPostUpdated} />
        ) : isManager ? (
          <PostForm
            date={selectedDate}
            clientId={managerClients[0].client_id}
            onSave={onPostCreated}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
            <p className="text-sm text-muted-foreground">
              No post scheduled for this date.
            </p>
          </div>
        )}
      </div>
      {post && showPreview && (
        <div className="p-4 bg-gray-50 overflow-auto">
          <SocialPreview post={post} />
        </div>
      )}
    </div>
  );
}
