import { Post } from "../../types/post";

interface FacebookPreviewProps {
  post: Post;
}

export function FacebookPreview({ post }: FacebookPreviewProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 500,
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <img
          src={post.creative || "/default-avatar.png"}
          alt="avatar"
          style={{ width: 36, height: 36, borderRadius: "50%" }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{post.clientName}</div>
          <div style={{ fontSize: 12, color: "#666" }}>Brand Page</div>
        </div>
      </div>

      {/* Caption */}
      <div style={{ marginBottom: 8 }}>{post.caption}</div>

      {/* Image */}
      {post.creative && (
        <img
          src={post.creative}
          alt="post"
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      )}

      {/* Footer */}
      <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
        {post.likes?.toLocaleString() || 0} likes • {post.comments || 0}{" "}
        comments
      </div>
    </div>
  );
}
