"use client";

import CardFlip from "@/components/kokonutui/card-flip";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <div className="relative w-[280px] h-[320px] rounded-2xl border border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900 shadow-xs dark:shadow-lg overflow-hidden">
              {/* Event image shimmer - matches CardFlip front face */}
              <div className="absolute inset-0 w-full h-full">
                <div className="h-full w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
              </div>
              {/* Overlay content shimmer */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {/* Event title shimmer */}
                <div className="h-6 w-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mb-2" />
                <div className="h-6 w-3/4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mb-3" />
                {/* Event details shimmer */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                  <div className="h-4 w-2/3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
                </div>
                {/* Button shimmer */}
                <div className="h-10 w-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
              </div>
            </div>
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
