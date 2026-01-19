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

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BlogContentRenderer from "./BlogContentRenderer";

export default async function BlogDetail({
  params,
}: {
  params: { id: string };
}) {
  const data = await getBlog(params.id);
  const blog = data?.blog;
  if (!blog) return <div className="pt-36 text-center">Blog not found.</div>;

  const authorName = `${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.trim();
  const authorInitials = `${blog.author?.firstName?.[0] || ""}${blog.author?.lastName?.[0] || ""}`;
  const content = String(blog.content || "");

  return (
    <main className="mx-auto max-w-3xl px-4 pt-36 pb-18">
      {blog.imageUrl && (
        <div className="relative h-64 w-full mb-6 overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
      <div className="flex items-center gap-3 text-sm text-white/60 mb-8 pb-8 border-b border-white/10">
        <Avatar className="h-10 w-10">
          {blog.author?.avatar && (
            <AvatarImage src={blog.author.avatar} alt={authorName} />
          )}
          <AvatarFallback className="bg-white/10 text-white/80 text-sm">
            {authorInitials || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white/90 font-medium">{authorName || "Unknown"}</p>
          <p className="text-white/50 text-xs">{new Date(blog.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <article className="blog-article">
        <BlogContentRenderer content={content} />
      </article>
    </main>
  );
}
