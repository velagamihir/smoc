export type FieldName =
  | "headline"
  | "body_copy"
  | "visual_brief"
  | "caption"
  | "general";

export interface Comment {
  id: string;
  post_id: string;
  field_name: FieldName;
  parent_id: string | null;
  user_id: string;
  content: string;
  created_at: string;
  // joined
  profile?: { full_name: string; role: string };
}
