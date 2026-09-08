import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BlogContentRenderer from "./BlogContentRenderer";
import ShareBlogButtons from "@/components/ShareBlogButtons";
import { Clock } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getBlog(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const encoded = encodeURIComponent(id);
  try {
    let res = await fetch(`${base}/blogs/${encoded}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) return res.json();

    // Fallback: fetch all published and find locally (handles edge cases and proxies)
    res = await fetch(`${base}/blogs`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const all = await res.json();
    const found = (all?.blogs || []).find(
      (b: { id: string | number }) => String(b.id) === String(id)
    );
    if (!found) return null;
    return { blog: found };
  } catch {
    return null;
  }
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const data = await getBlog(resolvedParams.id);
  const blog = data?.blog;
  if (!blog) {
    return (
      <main className="mx-auto max-w-3xl px-4 pt-36 pb-18 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Blog not found</h1>
        <p className="text-white/60 mb-6">The article you are looking for does not exist or has been removed.</p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </main>
    );
  }

  const authorName = `${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.trim();
  const authorInitials = `${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`;
  const content = String(blog.content || "");

  // Calculate reading time
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="mx-auto max-w-3xl px-4 pt-36 pb-18">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all blogs
      </Link>

      {blog.imageUrl && (
        <div className="relative h-64 sm:h-80 w-full mb-6 overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
        {blog.title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-white/60 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-md">
            {blog.author?.avatar && (
              <AvatarImage src={blog.author.avatar} alt={authorName} />
            )}
            <AvatarFallback className="bg-white/10 text-white/80 text-sm rounded-md font-medium">
              {authorInitials || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white/90 font-medium">{authorName || "Elixir Member"}</p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTimeMinutes} min read
              </span>
            </div>
          </div>
        </div>

        <ShareBlogButtons title={blog.title} />
      </div>

      <article className="blog-article">
        <BlogContentRenderer content={content} />
      </article>
    </main>
  );
}
