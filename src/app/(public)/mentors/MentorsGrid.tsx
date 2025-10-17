"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";
import { CheckCircle2, Heart } from "lucide-react";
import ContentSkeleton from "@/components/ContentSkeleton";

export default function MentorsGrid() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => (await api.get("/mentors")).data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const mentors = data?.mentors || [];

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-18">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
          Mentors
        </h1>
        <ContentSkeleton variant="mentor" count={6} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-18">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
          Mentors
        </h1>
        <p className="text-red-400 text-sm sm:text-base">
          Failed to load mentors. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-36 pb-12 sm:pb-18">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Mentors
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map(
          (m: {
            id: string | number;
            imageUrl?: string;
            avatar?: string;
            name: string;
            expertise?: string;
            linkedInUrl?: string;
            title?: string;
            role?: string;
            club?: { name?: string };
          }) => (
            <div
              key={m.id}
              className="relative w-[320px] flex-[0_0_320px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0C14] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative h-[420px] w-full">
                <Image
                  src={
                    m.imageUrl ||
                    m.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      m.name
                    )}&background=random&color=fff`
                  }
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                {/* Curved corners effect */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/10" />
                {/* Bottom gradient overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-x-5 bottom-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-semibold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                      {m.name}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 text-white/90" />
                  </div>
                  <p className="text-sm text-white/80">
                    {m.expertise || m.title || m.role || "Mentor"}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                      {m.club?.name && (
                        <>
                          <span>{m.club.name}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                      <Heart className="h-4 w-4" />
                      <span>48</span>
                    </div>

                    <a
                      href={m.linkedInUrl || "#"}
                      target={m.linkedInUrl ? "_blank" : undefined}
                      rel={m.linkedInUrl ? "noopener noreferrer" : undefined}
                      className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                    >
                      {m.linkedInUrl ? (
                        <>
                          <FaLinkedin className="h-4 w-4" />
                          Connect
                        </>
                      ) : (
                        "Follow +"
                      )}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
        {mentors.length === 0 && (
          <p className="col-span-full text-white/60">No mentors yet.</p>
        )}
      </div>
    </main>
  );
}
