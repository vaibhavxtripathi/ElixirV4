export const metadata = {
  title: "Elixir | Blogs",
  description: "Explore blogs by clubs.",
  alternates: { canonical: "/blogs" },
};

import BlogsGrid from "./BlogsGrid";

export default function BlogsPage() {
  return (
      <BlogsGrid />
  );
}
