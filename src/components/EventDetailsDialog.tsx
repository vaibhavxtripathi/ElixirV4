"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Logos from "@/icons/general";

interface EventDetailsDialogProps {
  open: boolean;
  logo?: string; // name of an exported logo component from @/icons/general
  event?: {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    club?: { name: string };
  };
  onClose: () => void;
}

export function EventDetailsDialog({
  open,
  logo,
  event,
  onClose,
}: EventDetailsDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0B1A]/95 backdrop-blur border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-lg sm:text-xl">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-white/60 text-sm">
            Event Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="w-full h-32 sm:h-48 rounded-lg overflow-hidden bg-white/10 border border-white/10">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Event Info */}
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "text-sm",
                  new Date(event.date) > new Date()
                    ? "bg-green-500/5 text-green-400 border border-green-500/20"
                    : "bg-red-500/5 text-red-400 border border-red-500/20"
                )}
              >
                {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-white font-medium mb-2">Description</h3>
              <p className="text-white/80 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <Calendar className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Date</p>
                  <p className="text-white font-medium">
                    {(() => {
                      const d = new Date(event.date);
                      return isNaN(d.getTime())
                        ? "—"
                        : d.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Time</p>
                  <p className="text-white font-medium">
                    {(() => {
                      const d = new Date(event.date);
                      return isNaN(d.getTime())
                        ? "—"
                        : d.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                    })()}
                  </p>
                </div>
              </div>

              {event.club && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 md:col-span-2">
                  {(() => {
                    const Comp = logo
                      ? (
                          Logos as Record<
                            string,
                            React.ComponentType<{ className?: string }>
                          >
                        )[logo]
                      : undefined;
                    return Comp ? (
                      <Comp className="w-6 h-6" />
                    ) : (
                      <Building2 className="w-5 h-5 text-white/60" />
                    );
                  })()}
                  <div>
                    <p className="text-white/60 text-sm">Organized by</p>
                    <p className="text-white font-medium">{event.club.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
