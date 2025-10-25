export const metadata = {
  title: "Elixir | Events",
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
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-18">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Events
      </h1>
      <EventsGrid page={page} />
    </main>
  );
}
