export type FormatType = "static" | "carousel";
export type PostStatus = "draft" | "ready" | "published";

export interface Post {
  id: string;
  brand_id: string;
  post_date: string; // "YYYY-MM-DD"
  day_of_week: string; // "Tue" | "Thu" | "Sat"
  content_bucket: string;
  format_label: string; // raw original e.g. "Carousel (5 Slides)"
  format_type: FormatType;
  format_variant: string | null; // "hero" | "saveable" | "educational" | null
  slide_count: number | null;
  headline: string | null;
  body_copy: string | null;
  visual_brief: string | null;
  caption: string | null;
  creative_link: string | null;
  creative: string | null; // base64 encoded image
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface PostCreatePayload {
  post_date: string;
  day_of_week: string;
  content_bucket: string;
  format_label: string;
  format_type: FormatType;
  format_variant?: string | null;
  slide_count?: number | null;
  headline?: string | null;
  body_copy?: string | null;
  visual_brief?: string | null;
  caption?: string | null;
  creative_link?: string | null;
  creative?: string | null; // base64 encoded image
  status?: PostStatus;
  brand_id?: string;
}

export interface PostUpdatePayload extends Partial<PostCreatePayload> {}
