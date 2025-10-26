"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";
import { CheckCircle2, Heart } from "lucide-react";
import { MentorSkeletonGrid } from "@/components/CustomSkeletons";
import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import AuthDialog from "@/components/auth-dialog";

// Type definitions
interface Mentor {
  id: string | number;
  imageUrl?: string;
  avatar?: string;
  name: string;
  expertise?: string;
  linkedInUrl?: string;
  title?: string;
  role?: string;
  club?: { name?: string };
  likeCount?: number;
}

interface MentorsResponse {
  mentors: Mentor[];
}

interface LikedMentorsResponse {
  likedMentors: Mentor[];
}

interface LikeResponse {
  liked: boolean;
  likeCount: number;
  message: string;
}

interface MutationContext {
  previousMentors?: MentorsResponse;
  previousLikedMentors?: LikedMentorsResponse;
}

// Memoized Mentor Card Component to prevent unnecessary re-renders
const MentorCard = memo(
  ({
    mentor,
    isLiked,
    isLiking,
    onLikeClick,
  }: {
    mentor: Mentor;
    isLiked: boolean;
    isLiking: boolean;
    onLikeClick: (mentorId: string) => void;
  }) => {
    const handleLikeClick = useCallback(() => {
      onLikeClick(String(mentor.id));
    }, [mentor.id, onLikeClick]);

    return (
      <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0C14] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative h-[420px] w-full">
          <Image
            src={
              mentor.imageUrl ||
              mentor.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                mentor.name
              )}&background=random&color=fff`
            }
            alt={mentor.name}
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
                {mentor.name}
              </h3>
              <CheckCircle2 className="h-5 w-5 text-white/90" />
            </div>
            <p className="text-sm text-white/80">
              {mentor.expertise || mentor.title || mentor.role || "Mentor"}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                {mentor.club?.name && (
                  <>
                    <span>{mentor.club.name}</span>
                  </>
                )}
              </div>
              <button
                onClick={handleLikeClick}
                disabled={isLiking}
                className={`flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLiked ? "bg-red-500/20 border-red-500/30" : ""
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{mentor.likeCount || 0}</span>
              </button>

              <a
                href={mentor.linkedInUrl || "#"}
                target={mentor.linkedInUrl ? "_blank" : undefined}
                rel={mentor.linkedInUrl ? "noopener noreferrer" : undefined}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
              >
                {mentor.linkedInUrl ? (
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
    );
  }
);

MentorCard.displayName = "MentorCard";

export default function MentorsGrid() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingMentorIds, setPendingMentorIds] = useState<Set<string>>(
    new Set()
  );
  const authTriggerRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  // Trigger auth dialog when showAuthDialog becomes true
  useEffect(() => {
    if (showAuthDialog && authTriggerRef.current) {
      authTriggerRef.current.click();
      setShowAuthDialog(false);
    }
  }, [showAuthDialog]);

  const { data, isLoading } = useQuery<MentorsResponse>({
    queryKey: ["mentors"],
    queryFn: async () => (await api.get("/mentors")).data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get user's liked mentors to show which ones are liked
  const { data: likedMentorsData } = useQuery<LikedMentorsResponse>({
    queryKey: ["liked-mentors"],
    queryFn: async () => {
      try {
        const response = await api.get("/mentors/liked");
        return response.data;
      } catch {
        // If user is not authenticated, return empty array
        return { likedMentors: [] };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });

  const likedMentorIds = useMemo(
    () =>
      new Set(
        (likedMentorsData?.likedMentors || []).map(
          (mentor: Mentor) => mentor.id
        )
      ),
    [likedMentorsData?.likedMentors]
  );

  const mentors = data?.mentors || [];

  // Mutation for liking/unliking mentors
  const likeMutation = useMutation<LikeResponse, Error, string>({
    mutationFn: async (mentorId: string) => {
      const response = await api.post(`/mentors/${mentorId}/like`);
      return response.data;
    },
    onMutate: async (mentorId: string) => {
      // Add to pending set
      setPendingMentorIds((prev) => new Set(prev).add(mentorId));

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["mentors"] });
      await queryClient.cancelQueries({ queryKey: ["liked-mentors"] });

      // Snapshot the previous value
      const previousMentors = queryClient.getQueryData<MentorsResponse>([
        "mentors",
      ]);
      const previousLikedMentors =
        queryClient.getQueryData<LikedMentorsResponse>(["liked-mentors"]);

      // Optimistically update the mentors cache
      queryClient.setQueryData<MentorsResponse>(["mentors"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          mentors: oldData.mentors.map((mentor: Mentor) => {
            if (mentor.id === mentorId) {
              const isCurrentlyLiked = likedMentorIds.has(String(mentor.id));
              return {
                ...mentor,
                likeCount: isCurrentlyLiked
                  ? Math.max(0, (mentor.likeCount || 0) - 1)
                  : (mentor.likeCount || 0) + 1,
              };
            }
            return mentor;
          }),
        };
      });

      // Optimistically update the liked mentors cache
      queryClient.setQueryData<LikedMentorsResponse>(
        ["liked-mentors"],
        (oldData) => {
          if (!oldData) return oldData;
          const isCurrentlyLiked = likedMentorIds.has(String(mentorId));

          if (isCurrentlyLiked) {
            // Remove from liked mentors
            return {
              ...oldData,
              likedMentors: oldData.likedMentors.filter(
                (mentor: Mentor) => mentor.id !== mentorId
              ),
            };
          } else {
            // Add to liked mentors (we'll need to get the mentor data)
            const mentor = previousMentors?.mentors?.find(
              (m: Mentor) => m.id === mentorId
            );
            if (mentor) {
              return {
                ...oldData,
                likedMentors: [
                  ...oldData.likedMentors,
                  { ...mentor, likeCount: (mentor.likeCount || 0) + 1 },
                ],
              };
            }
          }
          return oldData;
        }
      );

      // Return a context object with the snapshotted value
      return { previousMentors, previousLikedMentors };
    },
    onError: (error: Error, mentorId: string, context: unknown) => {
      // Remove from pending set
      setPendingMentorIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mentorId);
        return newSet;
      });

      // If the mutation fails, use the context returned from onMutate to roll back
      const mutationContext = context as MutationContext | undefined;
      if (mutationContext?.previousMentors) {
        queryClient.setQueryData(["mentors"], mutationContext.previousMentors);
      }
      if (mutationContext?.previousLikedMentors) {
        queryClient.setQueryData(
          ["liked-mentors"],
          mutationContext.previousLikedMentors
        );
      }

      if (
        (error as Error & { response?: { status?: number } }).response
          ?.status === 401
      ) {
        setShowAuthDialog(true);
      }
    },
    onSuccess: (data: LikeResponse, mentorId: string) => {
      // Remove from pending set
      setPendingMentorIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mentorId);
        return newSet;
      });

      // Update with the actual server response
      queryClient.setQueryData<MentorsResponse>(["mentors"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          mentors: oldData.mentors.map((mentor: Mentor) =>
            mentor.id === mentorId
              ? { ...mentor, likeCount: data.likeCount }
              : mentor
          ),
        };
      });

      // Update the liked mentors cache with actual data
      queryClient.setQueryData<LikedMentorsResponse>(
        ["liked-mentors"],
        (oldData) => {
          if (!oldData) return oldData;
          const isLiked = data.liked;

          if (isLiked) {
            // Add to liked mentors if not already there
            // We need to get the mentor from the mentors cache
            const mentorsData = queryClient.getQueryData<MentorsResponse>([
              "mentors",
            ]);
            const mentor = mentorsData?.mentors?.find(
              (m: Mentor) => m.id === mentorId
            );
            if (
              mentor &&
              !oldData.likedMentors.some((m: Mentor) => m.id === mentorId)
            ) {
              return {
                ...oldData,
                likedMentors: [
                  ...oldData.likedMentors,
                  { ...mentor, likeCount: data.likeCount },
                ],
              };
            }
          } else {
            // Remove from liked mentors
            return {
              ...oldData,
              likedMentors: oldData.likedMentors.filter(
                (mentor: Mentor) => mentor.id !== mentorId
              ),
            };
          }
          return oldData;
        }
      );
    },
    onSettled: (data: LikeResponse | undefined, error: Error | null) => {
      // Only refetch if there was an error or if we need to sync with server
      if (error) {
        queryClient.invalidateQueries({ queryKey: ["mentors"] });
        queryClient.invalidateQueries({ queryKey: ["liked-mentors"] });
      }
      // For success cases, we already updated the cache optimistically and with server response
      // No need to refetch unless we want to ensure data consistency
    },
  });

  const handleLikeClick = useCallback(
    (mentorId: string) => {
      likeMutation.mutate(mentorId);
    },
    [likeMutation]
  );

  if (isLoading) {
    return <MentorSkeletonGrid count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map((mentor: Mentor) => {
          const isLiked = likedMentorIds.has(String(mentor.id));
          const isLiking = pendingMentorIds.has(String(mentor.id));

          return (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              isLiked={isLiked}
              isLiking={isLiking}
              onLikeClick={handleLikeClick}
            />
          );
        })}
        {mentors.length === 0 && (
          <p className="col-span-full text-white/60">No mentors yet.</p>
        )}
      </div>

      {/* Hidden Auth Dialog Trigger */}
      <AuthDialog
        defaultMode="login"
        trigger={
          <button ref={authTriggerRef} className="hidden" aria-hidden="true">
            Login
          </button>
        }
      />
    </>
  );
}
