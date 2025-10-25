"use client";

import CardFlip from "@/components/kokonutui/card-flip";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ContentSkeleton from "@/components/ContentSkeleton";

type EventItem = {
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
};

export default function EventsGrid({ page }: { page: number }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const { data: eventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", page],
    queryFn: async () => {
      const res = await api.get(`/events?page=${page}&limit=12`);
      return res.data as {
        events: EventItem[];
        pagination?: { page: number; pages: number };
      };
    },
    staleTime: 60_000,
  });

  const { data: registrationsResponse } = useQuery({
    queryKey: ["registered-events"],
    queryFn: async () => {
      try {
        const res = await api.get("/events/registered");
        return res.data as {
          registrations: Array<{ event: { id: string | number } }>;
        };
      } catch {
        return {
          registrations: [] as Array<{ event: { id: string | number } }>,
        };
      }
    },
    staleTime: 60_000,
  });

  const events = eventsResponse?.events ?? [];
  const pagination = eventsResponse?.pagination ?? { page, pages: 1 };
  const registeredIds = new Set(
    (registrationsResponse?.registrations ?? []).map((r) => String(r.event.id))
  );

  const normalizeImageUrl = (input?: string) => {
    if (!input) return "";
    if (/^https?:\/\//i.test(input)) return input;
    if (input.startsWith("/")) return `${apiBase}${input}`;
    return "";
  };

  if (eventsLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <ContentSkeleton variant="event" count={1} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e: EventItem) => (
          <div key={e.id} className="flex items-center justify-center">
            <CardFlip
              title={e.title || e.name || "Event"}
              subtitle={e.organizer || e.club?.name || e.location || ""}
              description={e.description || ""}
              features={
                [
                  e.date
                    ? new Date(e.date).toLocaleDateString("en-us", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                    : undefined,
                  e.location,
                  e.category,
                  e.speakers?.[0]?.name,
                ].filter(Boolean) as string[]
              }
              eventId={String(e.id)}
              eventDate={e.date}
              isRegistered={registeredIds.has(String(e.id))}
              imageUrl={normalizeImageUrl(
                e.imageUrl ?? e.image ?? e.banner ?? e.cover ?? ""
              )}
              club={e.club?.name}
            />
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
    </>
  );
}
