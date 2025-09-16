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

import CardFlip from "@/components/kokonutui/card-flip";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number((await searchParams?.page) || 1);
  const data = await getEvents(page, 12);
  const events = data.events || [];
  const pagination = data.pagination || { page, pages: 1 };

  return (
    <main className="mx-auto max-w-6xl px-4 pt-36 pb-18">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(
          (e: {
            id: string | number;
            title?: string;
            name?: string;
            organizer?: string;
            club?: { name?: string };
            location?: string;
            description?: string;
            date?: string;
            category?: string;
            speakers?: Array<{ name?: string }>;
            imageUrl?: string;
            image?: string;
            banner?: string;
            cover?: string;
          }) => (
            <div key={e.id} className="flex items-center justify-center">
              <CardFlip
                title={e.title || e.name || "Event"}
                subtitle={e.organizer || e.club?.name || e.location || ""}
                description={e.description || ""}
                features={
                  [
                    e.date ? new Date(e.date).toLocaleString() : undefined,
                    e.location,
                    e.category,
                    e.speakers?.[0]?.name,
                  ].filter(Boolean) as string[]
                }
                eventId={String(e.id)}
                imageUrl={e.imageUrl ?? e.image ?? e.banner ?? e.cover ?? ""}
              />
            </div>
          )
        )}
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
