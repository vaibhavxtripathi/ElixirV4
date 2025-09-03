export const metadata = {
    title: "Blogs | Elixir",
    description: "Read our latest blog posts.",
  };
  
  async function getBlogs() {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${base}/blogs`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return res.json();
  }
  
  export default async function BlogsPage() {
    const data = await getBlogs();
    const blogs = data.blogs || [];
  
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Blogs</h1>
        <div className="space-y-6">
          {blogs.map((blog: any) => (
            <article key={blog.id} className="border rounded p-6">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-3">{blog.content}</p>
              <div className="text-sm text-gray-500">
                By {blog.author?.firstName} {blog.author?.lastName} • {new Date(blog.createdAt).toDateString()}
              </div>
            </article>
          ))}
          {blogs.length === 0 && <p className="text-gray-600">No blogs yet.</p>}
        </div>
      </main>
    );
  }