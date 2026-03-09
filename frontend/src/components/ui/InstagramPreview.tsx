import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Post } from "../../types/post";

interface InstagramPreviewProps {
  post: Post;
}

export function InstagramPreview({ post }: InstagramPreviewProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      style={{
        width: 375,
        border: "1px solid #dbdbdb",
        borderRadius: 28,
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: "#fff",
        margin: "0 auto",
      }}
    >
      {/* POST HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af)",
              padding: 2,
            }}
          >
            <img
              src={post.creative || "/default-avatar.png"}
              alt="avatar"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>{post.clientName}</span>
            {post.verified && (
              <span style={{ color: "#3897f0", marginLeft: 4 }}>✔</span>
            )}
          </div>
        </div>
        <div>⋯</div>
      </div>

      {/* POST IMAGE */}
      <div style={{ width: "100%", height: 360, background: "#eee" }}>
        {post.creative ? (
          <img
            src={post.creative}
            alt="post"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            No Image
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 12px",
          fontSize: 22,
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <Heart
            style={{ cursor: "pointer" }}
            color={liked ? "red" : "black"}
            onClick={() => setLiked(!liked)}
          />
          <MessageCircle />
          <Send />
        </div>
        <Bookmark />
      </div>

      {/* LIKES */}
      <div style={{ fontWeight: 600, padding: "0 14px", marginBottom: 4 }}>
        Liked by <strong>{post.likes?.toLocaleString() || 0}</strong> people
      </div>

      {/* CAPTION */}
      <div style={{ padding: "0 14px", marginBottom: 4 }}>
        <strong>{post.clientName}</strong> {post.caption}
      </div>

      {/* COMMENTS */}
      <div style={{ padding: "0 14px", fontSize: 14, color: "#8e8e8e" }}>
        View all {post.comments || 0} comments
      </div>

      {/* TIME */}
      <div
        style={{
          padding: "0 14px",
          fontSize: 10,
          color: "#8e8e8e",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {post.time || "1 HOUR AGO"}
      </div>

      {/* COMMENT BOX */}
      <div
        style={{
          borderTop: "1px solid #dbdbdb",
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#999" }}>😊 Add a comment...</span>
        <span style={{ color: "#3897f0", fontWeight: 600 }}>Post</span>
      </div>
    </div>
  );
}
