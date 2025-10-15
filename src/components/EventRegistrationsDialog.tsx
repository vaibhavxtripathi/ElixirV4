"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  registeredAt: string;
}

export function EventRegistrationsDialog({
  open,
  eventId,
  onClose,
}: {
  open: boolean;
  eventId?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [eventTitle, setEventTitle] = useState<string>("");

  useEffect(() => {
    if (!open || !eventId) return;
    let cancelled = false;
    setLoading(true);
    api
      .get(`/events/${eventId}/registrations`)
      .then((res) => {
        if (cancelled) return;
        setItems(res.data.registrations || []);
        setEventTitle(res.data.event?.title || "");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [open, eventId]);

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-2xl bg-[#0A0B1A]/95 backdrop-blur border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">
            Event Registrations {items.length > 0 && `(${items.length})`}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {eventTitle || "Registrations"}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto">
          {loading ? (
            <div className="py-12 text-center text-white/60">Loading...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-white/60">
              No registrations yet
            </div>
          ) : (
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="py-4 px-6 text-left font-medium">Name</th>
                    <th className="py-4 px-6 text-left font-medium">Email</th>
                    <th className="py-4 px-6 text-left font-medium whitespace-nowrap">
                      Registered At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {items.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6 text-white font-medium">
                        {r.name}
                      </td>
                      <td className="py-4 px-6 text-white/80">{r.email}</td>
                      <td className="py-4 px-6 text-white/60">
                        {new Date(r.registeredAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
