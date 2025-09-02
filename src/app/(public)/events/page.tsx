export const metadata = {
  title: "Events | Elixir",
  description: "Explore upcoming events by clubs.",
  alternates: { canonical: "/events" },
};

async function getEvents(page = 1, limit = 12) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const res = await fetch(`${base}/events?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

import EventCard from "@/components/EventCards";
import RegisterButton from "@/components/RegisterButton";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page || 1);
  const data = await getEvents(page, 12);
  const events = data.events || [];
  const pagination = data.pagination || { page, pages: 1 };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e: any) => (
          <div key={e.id} className="rounded-lg border p-4">
            <EventCard event={e} />
            <RegisterButton eventId={e.id} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-8">
        {page > 1 && (
          <a
            href={`/events?page=${page - 1}`}
            className="px-3 py-1 border rounded"
          >
            Previous
          </a>
        )}
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.pages}
        </span>
        {pagination.page < pagination.pages && (
          <a
            href={`/events?page=${page + 1}`}
            className="px-3 py-1 border rounded"
          >
            Next
          </a>
        )}
      </div>
    </main>
  );
}
