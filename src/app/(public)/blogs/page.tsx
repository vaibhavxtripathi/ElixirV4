export const metadata = {
  title: "Elixir | Blogs",
  description: "Explore blogs by clubs.",
  alternates: { canonical: "/blogs" },
};

import BlogsGrid from "./BlogsGrid";

export default function BlogsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>
      <BlogsGrid />
    </main>
  );
}
