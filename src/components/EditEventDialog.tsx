"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/date-time-picker";

export interface EditEventDialogProps {
  open: boolean;
  event?: {
    id: string;
    title: string;
    description: string;
    data: string;
    imageUrl?: string;
  };
  onClose: () => void;
  onSave: (payload: {
    title: string;
    description: string;
    data: string;
    imageUrl?: string;
  }) => void | Promise<void>;
  loading?: boolean;
}

export function EditEventDialog({
  open,
  event,
  onClose,
  onSave,
  loading,
}: EditEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setData(event.data || "");
      setImageUrl(event.imageUrl || "");
    }
  }, [event]);

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Edit Event</DialogTitle>
          <DialogDescription className="text-white/60 text-sm">
            Update your event details and save changes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-white">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-white">
              Event Date & Time
            </Label>
            <DateTimePicker
              value={data}
              onChange={setData}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-desc" className="text-white">
              Description
            </Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-img" className="text-white">
              Image URL
            </Label>
            <Input
              id="edit-img"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onSave({ title, description, data, imageUrl })}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
