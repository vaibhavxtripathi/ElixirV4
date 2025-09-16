"use client";

/**
 * @author: @dorian_baffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface CardFlipProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  imageUrl: string;
  eventId?: string;
}

export default function CardFlip({
  title,
  subtitle,
  description,
  features,
  imageUrl,
  eventId,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  return (
    <div
      className="relative w-[280px] h-[320px] mx-auto group [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative w-full h-full",
          "will-change-transform [transform:translateZ(0)] [transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]",
          // Prevent flip while CTA is hovered to avoid hover enter/leave thrash
          "group-hover/cta:[transform:rotateY(0deg)]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 w-full h-full",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl",
            "bg-zinc-50 dark:bg-zinc-900",
            "border border-zinc-200 dark:border-zinc-800/50",
            "shadow-xs dark:shadow-lg",
            "transition-all duration-700",
            "group-hover:shadow-lg dark:group-hover:shadow-xl",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {!imageUrl && (
            <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
              <div className="absolute inset-0 flex items-start justify-center pt-24">
                <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute w-[50px] h-[50px]",
                        "rounded-[140px]",
                        "animate-[scale_3s_linear_infinite]",
                        "opacity-0",
                        "shadow-[0_0_50px_rgba(37,99,235,0.45)]",
                        "group-hover:animate-[scale_2s_linear_infinite]"
                      )}
                      style={{
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-200 line-clamp-2 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]">
                  {subtitle}
                </p>
              </div>
              <div className="relative group/icon">
                <div
                  className={cn(
                    "pointer-events-none absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                    "bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent"
                  )}
                />
                <Repeat2 className="relative z-10 w-4 h-4 text-blue-500 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "p-6 rounded-2xl",
            "bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black",
            "border border-zinc-200 dark:border-zinc-800",
            "shadow-xs dark:shadow-lg",
            "flex flex-col",
            "transition-all duration-700",
            "group-hover:shadow-lg dark:group-hover:shadow-xl",
            !isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                {title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] line-clamp-2">
                {description}
              </p>
            </div>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 transition-all duration-500"
                  style={{
                    transform: isFlipped
                      ? "translateX(0)"
                      : "translateX(-10px)",
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}
                >
                  <ArrowRight className="w-3 h-3 text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              // Named group to let the flipper opt-out of rotating while CTA hovered
              data-cta
              className={cn(
                "group/start group/cta relative block w-full",
                "p-3 rounded-xl",
                " will-change-transform [transform:translateZ(0)] [backface-visibility:hidden] transition-colors duration-300",
                "bg-gradient-to-r from-zinc-100 via-zinc-100 to-zinc-100",
                "dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800",
                "hover:from-blue-500/10 hover:from-0% hover:via-blue-500/5 hover:via-100% hover:to-transparent hover:to-100%",
                "dark:hover:from-blue-500/20 dark:hover:from-0% dark:hover:via-blue-500/10 dark:hover:via-100% dark:hover:to-transparent dark:hover:to-100%",
                "hover:scale-[1.005] hover:cursor-pointer",
                isRegistering && "opacity-60 cursor-wait"
              )}
              disabled={isRegistering}
              aria-busy={isRegistering}
              onClick={async () => {
                if (!eventId) return;
                try {
                  setIsRegistering(true);
                  await api.post(`/events/${eventId}/register`);
                  toast.success("Registered successfully");
                  router.push("/student");
                } catch (e) {
                  // Narrow axios-like errors
                  const maybeAxiosError = e as {
                    response?: { status?: number; data?: { message?: string } };
                  };
                  const status = maybeAxiosError.response?.status;
                  const msg =
                    maybeAxiosError.response?.data?.message ||
                    "Failed to register";
                  if (status === 401) {
                    router.push("/login");
                    return;
                  }
                  if (status === 403) {
                    toast.error("Only students can register.");
                    return;
                  }
                  toast.error(msg);
                } finally {
                  setIsRegistering(false);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-900 dark:text-white transition-colors duration-300 group-hover/start:text-blue-600 dark:group-hover/start:text-blue-400">
                  {isRegistering ? "Registering..." : "Register"}
                </span>
                <div className="relative group/icon">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-[-6px] rounded-lg transition-opacity duration-300",
                      "bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent",
                      "opacity-0 group-hover/start:opacity-100 scale-90 group-hover/start:scale-100"
                    )}
                  />
                  {isRegistering ? (
                    <div className="relative z-10 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  ) : (
                    <ArrowRight className="relative z-10 w-4 h-4 text-blue-500 transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110" />
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale {
          0% {
            transform: scale(2);
            opacity: 0;
            box-shadow: 0px 0px 50px rgba(255, 165, 0, 0.5);
          }
          50% {
            transform: translate(0px, -5px) scale(1);
            opacity: 1;
            box-shadow: 0px 8px 20px rgba(255, 165, 0, 0.5);
          }
          100% {
            transform: translate(0px, 5px) scale(0.1);
            opacity: 0;
            box-shadow: 0px 10px 20px rgba(255, 165, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
