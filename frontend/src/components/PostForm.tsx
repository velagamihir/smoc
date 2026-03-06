import { useRef, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { createPost } from "../lib/api";
import { PostCreatePayload, FormatType, PostStatus } from "../types/post";

interface PostFormProps {
  date: Date;
  brandId: string;
  onSave: () => void;
}

export function PostForm({ date, brandId, onSave }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contentBucket, setContentBucket] = useState("");
  const [formatType, setFormatType] = useState<FormatType>("static");
  const [formatVariant, setFormatVariant] = useState("");
  const [slideCount, setSlideCount] = useState<string>("");
  const [headline, setHeadline] = useState("");
  const [bodyCopy, setBodyCopy] = useState("");
  const [visualBrief, setVisualBrief] = useState("");
  const [caption, setCaption] = useState("");
  const [creative, setCreative] = useState<string | null>(null);
  const [creativeName, setCreativeName] = useState<string | null>(null);
  const [status, setStatus] = useState<PostStatus>("draft");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = dayNames[date.getDay()];
  const postDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const buildFormatLabel = () => {
    if (formatType === "static") {
      return formatVariant ? `Static (${formatVariant})` : "Static";
    }
    if (slideCount) return `Carousel (${slideCount} Slides)`;
    if (formatVariant) return `Carousel (${formatVariant})`;
    return "Carousel";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCreativeName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCreative(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: PostCreatePayload = {
        post_date: postDateStr,
        day_of_week: dayOfWeek,
        content_bucket: contentBucket,
        format_label: buildFormatLabel(),
        format_type: formatType,
        format_variant: formatVariant || null,
        slide_count: slideCount ? parseInt(slideCount) : null,
        headline: headline || null,
        body_copy: bodyCopy || null,
        visual_brief: visualBrief || null,
        caption: caption || null,
        creative: creative || null,
        status,
        brand_id: brandId,
      };
      await createPost(payload);
      onSave();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* ── Post Setup ── */}
        <div className="px-6 pt-5 pb-4 space-y-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Post Setup
          </p>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Content Bucket <span className="text-destructive">*</span>
            </label>
            <input
              required
              value={contentBucket}
              onChange={(e) => setContentBucket(e.target.value)}
              placeholder="e.g. Brand Philosophy"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Format <span className="text-destructive">*</span>
              </label>
              <Select
                value={formatType}
                onValueChange={(v) => setFormatType(v as FormatType)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Variant</label>
              <input
                value={formatVariant}
                onChange={(e) => setFormatVariant(e.target.value)}
                placeholder="Hero, Save-able…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60"
              />
            </div>
          </div>

          {formatType === "carousel" && (
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Slide Count
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={slideCount}
                onChange={(e) => setSlideCount(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60"
              />
            </div>
          )}
        </div>

        <Separator className="opacity-30" />

        {/* ── Copy ── */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Copy
          </p>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Headline</label>
            <textarea
              rows={2}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="The hook for this post"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Body Copy</label>
            <textarea
              rows={5}
              value={bodyCopy}
              onChange={(e) => setBodyCopy(e.target.value)}
              placeholder="Full post content / slide breakdown..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Caption</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Social media caption..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60 resize-none"
            />
          </div>
        </div>

        <Separator className="opacity-30" />

        {/* ── Creative ── */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Creative
          </p>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Visual Brief
            </label>
            <textarea
              rows={3}
              value={visualBrief}
              onChange={(e) => setVisualBrief(e.target.value)}
              placeholder="Design direction for the creative team..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400/60 resize-none"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Upload Creative
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {creative ? (
              <div className="relative rounded-xl overflow-hidden border border-border/40 bg-accent/10">
                <img
                  src={creative}
                  alt="creative preview"
                  className="w-full object-cover max-h-48"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCreative(null);
                    setCreativeName(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 size-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                >
                  <XIcon className="size-3 text-white" />
                </button>
                <p className="px-3 py-1.5 text-[10px] text-muted-foreground truncate border-t border-border/30">
                  {creativeName}
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>

        <Separator className="opacity-30" />

        {/* ── Publishing ── */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Publishing
          </p>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as PostStatus)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="px-6 pb-4">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 pt-4 border-t">
        <Button
          type="submit"
          disabled={loading || !contentBucket}
          className="w-full"
        >
          {loading ? "Saving..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
