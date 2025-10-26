export const metadata = {
  title: "Elixir | Events",
  description: "Explore upcoming events by clubs.",
  alternates: { canonical: "/events" },
};

import EventsGrid from "./EventsGrid";
import Container from "@/components/container";
import PageHeader from "@/components/PageHeader";

export default function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page ?? 1);

  return (
    <main className="pt-32 sm:pt-36 pb-12 sm:pb-18">
      <Container>
        <PageHeader title="Events" />
        <EventsGrid page={page} />
      </Container>
    </main>
  );
}
