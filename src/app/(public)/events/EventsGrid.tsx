"use client";

import { useState, useMemo } from "react";
import CardFlip from "@/components/kokonutui/card-flip";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { EventSkeletonGrid } from "@/components/CustomSkeletons";
import { Search, X, Calendar, Sparkles, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GFGLogo, GDGLogo, CCLogo } from "@/icons/general";

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

type ClubFilter = "ALL" | "GFG" | "GDG" | "CODECHEF";
type StatusFilter = "ALL" | "UPCOMING" | "PAST";

export default function EventsGrid({ page }: { page: number }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<ClubFilter>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");

  const { data: eventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", page],
    queryFn: async () => {
      const res = await api.get(`/events?page=${page}&limit=24`);
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

  const rawEvents = eventsResponse?.events ?? [];
  const pagination = eventsResponse?.pagination ?? { page, pages: 1 };
  const registeredIds = useMemo(
    () =>
      new Set(
        (registrationsResponse?.registrations ?? []).map((r) => String(r.event.id))
      ),
    [registrationsResponse]
  );

  const normalizeImageUrl = (input?: string) => {
    if (!input) return "";
    if (/^https?:\/\//i.test(input)) return input;
    if (input.startsWith("/")) return `${apiBase}${input}`;
    return "";
  };

  // Client-side filtering by search query, club, and status
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((e) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (e.title || e.name || "").toLowerCase();
        const desc = (e.description || "").toLowerCase();
        const clubName = (e.club?.name || e.organizer || "").toLowerCase();
        const loc = (e.location || "").toLowerCase();
        const cat = (e.category || "").toLowerCase();
        const matches =
          title.includes(query) ||
          desc.includes(query) ||
          clubName.includes(query) ||
          loc.includes(query) ||
          cat.includes(query);
        if (!matches) return false;
      }

      // 2. Club filter
      if (selectedClub !== "ALL") {
        const clubName = (e.club?.name || e.organizer || "").toUpperCase();
        if (selectedClub === "GFG" && !clubName.includes("GFG")) return false;
        if (selectedClub === "GDG" && !clubName.includes("GDG") && !clubName.includes("GDSC"))
          return false;
        if (selectedClub === "CODECHEF" && !clubName.includes("CODECHEF") && !clubName.includes("CC"))
          return false;
      }

      // 3. Status filter
      if (selectedStatus !== "ALL" && e.date) {
        const eventTime = new Date(e.date).getTime();
        const now = Date.now();
        const isUpcoming = !Number.isNaN(eventTime) && eventTime >= now;
        if (selectedStatus === "UPCOMING" && !isUpcoming) return false;
        if (selectedStatus === "PAST" && isUpcoming) return false;
      }

      return true;
    });
  }, [rawEvents, searchQuery, selectedClub, selectedStatus]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedClub !== "ALL" || selectedStatus !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClub("ALL");
    setSelectedStatus("ALL");
  };

  if (eventsLoading) {
    return <EventSkeletonGrid count={6} />;
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#080914]/60 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, topic, club, or speaker..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Club Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setSelectedClub("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedClub === "ALL"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              All Clubs
            </button>
            <button
              type="button"
              onClick={() => setSelectedClub("GFG")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedClub === "GFG"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <GFGLogo className="w-3.5 h-3.5" />
              <span>GFG</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedClub("GDG")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedClub === "GDG"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <GDGLogo className="w-3.5 h-3.5" />
              <span>GDG</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedClub("CODECHEF")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedClub === "CODECHEF"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <CCLogo className="w-3.5 h-3.5" />
              <span>CodeChef</span>
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setSelectedStatus("ALL")}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedStatus === "ALL"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("UPCOMING")}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedStatus === "UPCOMING"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("PAST")}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                selectedStatus === "PAST"
                  ? "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid or Empty State */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((e: EventItem) => (
            <div key={e.id} className="flex items-center justify-center">
              <CardFlip
                title={e.title || e.name || "Event"}
                subtitle={e.organizer || e.club?.name || e.location || ""}
                description={e.description || ""}
                features={
                  [
                    e.date
                      ? new Date(e.date).toLocaleDateString("en-US", {
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
      ) : (
        /* Empty State */
        <div className="py-16 px-4 rounded-3xl border border-white/10 bg-[#080914]/40 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
            {hasActiveFilters
              ? "We couldn't find any events matching your current search criteria or club filters."
              : "There are currently no events published. Stay tuned for upcoming workshops and hackathons!"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <Filter className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Styled Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-xs text-white/50">
            Showing page <span className="text-white font-medium">{pagination.page}</span> of{" "}
            <span className="text-white font-medium">{pagination.pages}</span>
          </div>

          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/events?page=${page - 1}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/30 text-xs cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/events?page=${p}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    p === pagination.page
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "border border-white/10 bg-white/5 hover:bg-white/10 text-white/70"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {pagination.page < pagination.pages ? (
              <Link
                href={`/events?page=${page + 1}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/30 text-xs cursor-not-allowed">
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
