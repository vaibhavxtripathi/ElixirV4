import Image from "next/image";

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
      (b: any) => String(b.id) === String(id)
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
  params: { id: string };
}) {
  const data = await getBlog(params.id);
  const blog = data?.blog;
  if (!blog) return <div className="pt-36 text-center">Blog not found.</div>;

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
      <div className="text-sm text-white/60 mb-6">
        By {blog.author?.firstName} {blog.author?.lastName} •{" "}
        {new Date(blog.createdAt).toDateString()}
      </div>
      <article className="prose prose-invert max-w-none">
        {blog.content}
      </article>
    </main>
  );
}
