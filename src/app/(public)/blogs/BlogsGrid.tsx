"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BlogSkeletonGrid } from "@/components/CustomSkeletons";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, X, BookOpen, Clock, Filter } from "lucide-react";

// Utility function to strip HTML tags and markdown syntax for preview
function getPlainTextPreview(content: string): string {
  let text = content;

  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Strip markdown syntax
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");
  text = text.replace(/~~([^~]+)~~/g, "$1");
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  text = text.replace(/^>\s+/gm, "");
  text = text.replace(/^[-*+]\s+/gm, "");
  text = text.replace(/^\d+\.\s+/gm, "");
  text = text.replace(/^[-*_]{3,}\s*$/gm, "");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");

  // Clean up whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
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
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const blogs: Blog[] = data?.blogs || [];

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    const q = searchQuery.toLowerCase();
    return blogs.filter((blog) => {
      const title = (blog.title || "").toLowerCase();
      const content = (blog.content || "").toLowerCase();
      const author = `${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.toLowerCase();
      return title.includes(q) || content.includes(q) || author.includes(q);
    });
  }, [blogs, searchQuery]);

  if (isLoading) {
    return <BlogSkeletonGrid count={6} />;
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center text-red-400">
        <p className="font-medium mb-1">Failed to load articles</p>
        <p className="text-xs text-white/50">Please check your connection and try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#080914]/60 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic, or author..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="hidden sm:flex items-center text-xs text-white/50 px-2">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
        </div>
      </div>

      {/* Blogs Grid or Empty State */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog: Blog) => {
            const readingTime = calculateReadingTime(blog.content || "");
            const authorName = `${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.trim() || "Community Member";

            return (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="group block overflow-hidden rounded-2xl border border-blue-500/10 bg-[#080914] hover:bg-[#0b0c1b] transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:border-blue-500/30"
              >
                {/* Card image */}
                <div className="relative h-60 sm:h-64 w-full overflow-hidden">
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
                    <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-white/20">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}

                  {/* Reading Time Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/80 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
                    <Avatar className="h-6 w-6 shrink-0">
                      {blog.author?.avatar && (
                        <AvatarImage src={blog.author.avatar} alt={authorName} />
                      )}
                      <AvatarFallback className="bg-white/10 text-white/80 text-[10px] font-medium">
                        {blog.author?.firstName?.[0] || ""}
                        {blog.author?.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[140px] font-medium text-white/80">
                      {authorName}
                    </span>
                    <span>•</span>
                    <span className="text-white/50">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="mt-2 text-sm text-white/70 line-clamp-3 leading-relaxed">
                    {getPlainTextPreview(blog.content || "")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 rounded-3xl border border-white/10 bg-[#080914]/40 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
            {searchQuery
              ? `We couldn't find any articles matching "${searchQuery}".`
              : "No blogs have been published yet. Be the first to share a tutorial or story from your dashboard!"}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <Filter className="w-4 h-4" />
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
