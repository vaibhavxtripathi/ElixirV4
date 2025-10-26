export const metadata = {
  title: "Elixir | Blogs",
  description: "Explore blogs by clubs.",
  alternates: { canonical: "/blogs" },
};

import BlogsGrid from "./BlogsGrid";
import Container from "@/components/container";
import PageHeader from "@/components/PageHeader";

export default function BlogsPage() {
  return (
    <main className="pt-32 sm:pt-36 pb-12 sm:pb-18">
      <Container>
        <PageHeader title="Blogs" />
        <BlogsGrid />
      </Container>
    </main>
  );
}
