import { useEffect, useRef, useState } from "react";
import { Post, PostUpdatePayload } from "../types/post";
import { FieldName } from "../types/comment";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { CommentThread } from "../components/CommentThread";
import { getCommentCounts, updatePost } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  PencilIcon,
  CheckIcon,
  XIcon,
  ImageIcon,
  UploadIcon,
} from "lucide-react";

interface PostDetailProps {
  post: Post;
  onPostUpdated: (updated: Post) => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/15 text-yellow-400",
  ready: "bg-blue-500/15 text-blue-400",
  published: "bg-green-500/15 text-green-400",
};

const formatColors: Record<string, string> = {
  static: "bg-blue-500/15 text-blue-400",
  carousel: "bg-orange-500/15 text-orange-400",
};

// ── Per-field row with label + comment bubble + editable textarea ──
function FieldRow({
  label,
  value,
  fieldName,
  postId,
  commentCounts,
  onCountChange,
  editMode,
  editValue,
  onEditChange,
}: {
  label: string;
  value: string | null | undefined;
  fieldName: FieldName;
  postId: string;
  commentCounts: Record<string, number>;
  onCountChange: (field: FieldName, delta: number) => void;
  editMode: boolean;
  editValue: string;
  onEditChange: (v: string) => void;
}) {
  if (!value && !editMode) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <CommentThread
          postId={postId}
          fieldName={fieldName}
          fieldLabel={label}
          commentCount={commentCounts[fieldName] ?? 0}
          onCountChange={(delta) => onCountChange(fieldName, delta)}
        />
      </div>

      {editMode ? (
        <textarea
          rows={Math.max(
            fieldName === "headline" ? 2 : 3,
            editValue.split("\n").length,
          )}
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm leading-normal focus:outline-none focus:border-violet-400/60 resize-none"
        />
      ) : (
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {value}
        </p>
      )}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────
export function PostDetail({ post, onPostUpdated }: PostDetailProps) {
  const { profile } = useAuth();
  const isManager = profile?.role === "manager";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {},
  );
  const [edits, setEdits] = useState<PostUpdatePayload>({});
  const [creativePreview, setCreativePreview] = useState<string | null>(null);

  useEffect(() => {
    setEditMode(false);
    setEdits({});
    setCreativePreview(null);
    getCommentCounts(post.id).then(setCommentCounts);
  }, [post.id]);

  const handleCountChange = (field: FieldName, delta: number) =>
    setCommentCounts((prev) => ({
      ...prev,
      [field]: (prev[field] ?? 0) + delta,
    }));

  const startEdit = () => {
    setEdits({
      headline: post.headline ?? "",
      body_copy: post.body_copy ?? "",
      visual_brief: post.visual_brief ?? "",
      caption: post.caption ?? "",
      status: post.status,
    });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEdits({});
    setCreativePreview(null);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const payload: PostUpdatePayload = { ...edits };
      if (creativePreview !== null) payload.creative = creativePreview;
      const updated = await updatePost(post.id, payload);
      onPostUpdated(updated);
      setEditMode(false);
      setCreativePreview(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCreativeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCreativePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const currentCreative = creativePreview ?? post.creative;

  const formatLabel =
    post.format_type === "carousel"
      ? `Carousel${post.slide_count ? ` · ${post.slide_count} slides` : post.format_variant ? ` · ${post.format_variant}` : ""}`
      : `Static${post.format_variant ? ` · ${post.format_variant}` : ""}`;

  return (
    <div className="flex flex-col h-full">
      {/* Badges + edit controls */}
      <div className="px-6 pt-5 pb-3 space-y-2 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
              formatColors[post.format_type],
            )}
          >
            {formatLabel}
          </span>

          {editMode ? (
            <Select
              value={edits.status ?? post.status}
              onValueChange={(v) =>
                setEdits((p) => ({ ...p, status: v as Post["status"] }))
              }
            >
              <SelectTrigger className="h-5 w-28 text-[10px] px-2 rounded-full border-border/40 bg-accent/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft" className="text-[11px]">
                  draft
                </SelectItem>
                <SelectItem value="ready" className="text-[11px]">
                  ready
                </SelectItem>
                <SelectItem value="published" className="text-[11px]">
                  published
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                statusColors[post.status],
              )}
            >
              {post.status}
            </span>
          )}

          {isManager && !editMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startEdit}
              className="ml-auto h-6 px-2 text-[10px] gap-1"
            >
              <PencilIcon className="size-2.5" /> Edit
            </Button>
          )}
          {isManager && editMode && (
            <div className="ml-auto flex gap-1.5">
              <Button
                size="sm"
                onClick={saveEdit}
                disabled={saving}
                className="h-6 px-2 text-[10px] gap-1 bg-violet-600 hover:bg-violet-500 text-white"
              >
                <CheckIcon className="size-2.5" /> {saving ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEdit}
                className="h-6 px-2 text-[10px] gap-1"
              >
                <XIcon className="size-2.5" /> Cancel
              </Button>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {post.content_bucket}
        </p>
      </div>

      <Separator className="opacity-30" />

      {/* Fields */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-5">
          {/* ── Creative image ── */}
          {(currentCreative || editMode) && (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Creative
                  </span>
                  {isManager && editMode && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    >
                      <UploadIcon className="size-3" />
                      {currentCreative ? "Replace" : "Upload"}
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCreativeFile}
                />

                {currentCreative ? (
                  <div className="relative rounded-xl overflow-hidden border border-border/40 bg-accent/10">
                    <img
                      src={currentCreative}
                      alt="creative"
                      className="w-full object-cover max-h-56"
                    />
                    {isManager && editMode && (
                      <button
                        onClick={() => {
                          setCreativePreview("");
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 size-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                      >
                        <XIcon className="size-3 text-white" />
                      </button>
                    )}
                  </div>
                ) : isManager && editMode ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border border-dashed border-border/50 bg-accent/10 hover:bg-accent/20 hover:border-border/80 transition-colors px-4 py-5 flex flex-col items-center gap-2"
                  >
                    <ImageIcon className="size-5 text-muted-foreground/50" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload image
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">
                      PNG, JPG, WEBP
                    </span>
                  </button>
                ) : null}
              </div>
              <Separator className="opacity-50" />
            </>
          )}

          <FieldRow
            label="Headline"
            fieldName="headline"
            postId={post.id}
            value={post.headline}
            commentCounts={commentCounts}
            onCountChange={handleCountChange}
            editMode={editMode}
            editValue={edits.headline ?? ""}
            onEditChange={(v) => setEdits((p) => ({ ...p, headline: v }))}
          />

          <Separator className="opacity-50" />

          <FieldRow
            label="Body Copy"
            fieldName="body_copy"
            postId={post.id}
            value={post.body_copy}
            commentCounts={commentCounts}
            onCountChange={handleCountChange}
            editMode={editMode}
            editValue={edits.body_copy ?? ""}
            onEditChange={(v) => setEdits((p) => ({ ...p, body_copy: v }))}
          />

          <Separator className="opacity-50" />

          <FieldRow
            label="Visual Brief"
            fieldName="visual_brief"
            postId={post.id}
            value={post.visual_brief}
            commentCounts={commentCounts}
            onCountChange={handleCountChange}
            editMode={editMode}
            editValue={edits.visual_brief ?? ""}
            onEditChange={(v) => setEdits((p) => ({ ...p, visual_brief: v }))}
          />

          <Separator className="opacity-50" />

          <FieldRow
            label="Caption"
            fieldName="caption"
            postId={post.id}
            value={post.caption}
            commentCounts={commentCounts}
            onCountChange={handleCountChange}
            editMode={editMode}
            editValue={edits.caption ?? ""}
            onEditChange={(v) => setEdits((p) => ({ ...p, caption: v }))}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
