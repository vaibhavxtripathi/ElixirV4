"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BlogSkeletonGrid } from "@/components/CustomSkeletons";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Utility function to strip HTML tags and markdown syntax for preview
function getPlainTextPreview(content: string): string {
  let text = content;
  
  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, "");
  
  // Strip markdown syntax
  // Headers
  text = text.replace(/^#{1,6}\s+/gm, "");
  // Bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");
  // Strikethrough
  text = text.replace(/~~([^~]+)~~/g, "$1");
  // Code blocks
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`([^`]+)`/g, "$1");
  // Links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // Images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  // Blockquotes
  text = text.replace(/^>\s+/gm, "");
  // Lists
  text = text.replace(/^[-*+]\s+/gm, "");
  text = text.replace(/^\d+\.\s+/gm, "");
  // Horizontal rules
  text = text.replace(/^[-*_]{3,}\s*$/gm, "");
  // HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  
  // Clean up whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();
  
  return text;
}

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: { firstName?: string; lastName?: string; avatar?: string | null };
  imageUrl?: string;
};

export default function BlogsGrid() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const blogs = data?.blogs || [];

  if (isLoading) {
    return <BlogSkeletonGrid count={6} />;
  }

  if (error) {
    return (
      <p className="text-red-400 text-sm sm:text-base">
        Failed to load blogs. Please try again later.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog: Blog) => (
        <a
          key={blog.id}
          href={`/blogs/${blog.id}`}
          className="group block overflow-hidden rounded-2xl border border-blue-500/10 bg-[##080914] hover:bg-[#0b0c1b] transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
        >
          {/* Card image */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden">
            {blog.imageUrl ? (
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
            )}
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
              <Avatar className="h-6 w-6 shrink-0">
                {blog.author?.avatar && (
                  <AvatarImage src={blog.author.avatar} alt={`${blog.author.firstName} ${blog.author.lastName}`} />
                )}
                <AvatarFallback className="bg-white/10 text-white/80 text-[10px] font-medium">
                  {blog.author?.firstName?.[0] || ""}
                  {blog.author?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <span>
                {blog.author?.firstName} {blog.author?.lastName}
              </span>
              <span>• {new Date(blog.createdAt).toDateString()}</span>
            </div>
            <h2 className="text-xl font-semibold text-white group-hover:translate-y-[-1px] transition-transform duration-200">
              {blog.title}
            </h2>
            <p className="mt-2 text-sm text-white/70 line-clamp-3">
              {getPlainTextPreview(blog.content || "")}
            </p>
          </div>
        </a>
      ))}
      {blogs.length === 0 && (
        <p className="text-gray-400 mt-6">No blogs yet.</p>
      )}
    </div>
  );
}
