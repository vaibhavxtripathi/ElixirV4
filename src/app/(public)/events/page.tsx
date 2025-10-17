export const metadata = {
  title: "Events | Elixir",
  description: "Explore upcoming events by clubs.",
  alternates: { canonical: "/events" },
};

import EventsGrid from "./EventsGrid";

export default function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page ?? 1);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
      <h1 className="text-2xl font-bold mb-6">Events</h1>
      <EventsGrid page={page} />
    </main>
  );
}
