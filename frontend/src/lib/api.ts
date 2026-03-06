import { Post, PostCreatePayload, PostUpdatePayload } from "../types/post";
import { Comment, FieldName } from "../types/comment";

const BASE = "http://localhost:8000";
const SESSION_KEY = "calendar_session";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Posts ──────────────────────────────────────────────────────
export const getPosts = (
  brandId?: string,
  month?: number,
  year?: number,
): Promise<Post[]> => {
  const params = new URLSearchParams();
  if (brandId) params.set("brand_id", brandId);
  if (month !== undefined) params.set("month", String(month));
  if (year !== undefined) params.set("year", String(year));
  const qs = params.toString();
  return request<Post[]>(`/posts${qs ? `?${qs}` : ""}`);
};

export const getPost = (id: string): Promise<Post> =>
  request<Post>(`/posts/${id}`);

export const createPost = (data: PostCreatePayload): Promise<Post> =>
  request<Post>("/posts", { method: "POST", body: JSON.stringify(data) });

export const updatePost = (
  id: string,
  data: PostUpdatePayload,
): Promise<Post> =>
  request<Post>(`/posts/${id}`, { method: "PUT", body: JSON.stringify(data) });

// ── Comments ───────────────────────────────────────────────────
export const getComments = (
  postId: string,
  fieldName?: FieldName,
): Promise<Comment[]> => {
  const params = new URLSearchParams({ post_id: postId });
  if (fieldName) params.set("field_name", fieldName);
  return request<Comment[]>(`/comments?${params}`);
};

export const getCommentCounts = (
  postId: string,
): Promise<Record<string, number>> =>
  request<Record<string, number>>(`/comments/counts?post_id=${postId}`);

export const createComment = (data: {
  post_id: string;
  field_name: FieldName;
  content: string;
  parent_id?: string;
}): Promise<Comment> =>
  request<Comment>("/comments", { method: "POST", body: JSON.stringify(data) });
