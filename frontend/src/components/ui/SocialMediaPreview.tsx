import { useState } from "react";
import { InstagramPreview } from "./InstagramPreview";
import { LinkedInPreview } from "./LinkedInPreview";
import { FacebookPreview } from "./FacebookPreview";
import { Post } from "../../types/post";

interface SocialPreviewProps {
  post: Post;
}

export function SocialPreview({ post }: SocialPreviewProps) {
  const [activeTab, setActiveTab] = useState<
    "instagram" | "linkedin" | "facebook"
  >("instagram");

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Tabs */}
      <div className="flex border-b">
        {["instagram", "linkedin", "facebook"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="p-4">
        {activeTab === "instagram" && <InstagramPreview post={post} />}
        {activeTab === "linkedin" && <LinkedInPreview post={post} />}
        {activeTab === "facebook" && <FacebookPreview post={post} />}
      </div>
    </div>
  );
}
