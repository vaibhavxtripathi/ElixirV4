export const metadata = {
  title: "Elixir | Mentors",
  description: "Explore mentors by clubs.",
  alternates: { canonical: "/mentors" },
};

import MentorsGrid from "./MentorsGrid";
import Container from "@/components/container";
import PageHeader from "@/components/PageHeader";

export default function MentorsPage() {
  return (
    <main className="pt-32 sm:pt-36 pb-12 sm:pb-18">
      <Container>
        <PageHeader title="Mentors" />
        <MentorsGrid />
      </Container>
    </main>
  );
}
