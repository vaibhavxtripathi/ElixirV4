"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FaXTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";

interface ShareBlogButtonsProps {
  title: string;
  url?: string;
}

export default function ShareBlogButtons({ title, url }: ShareBlogButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const copyToClipboard = async () => {
    try {
      const shareUrl = getShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToTwitter = () => {
    const shareUrl = getShareUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToLinkedIn = () => {
    const shareUrl = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToWhatsApp = () => {
    const shareUrl = getShareUrl();
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} - ${shareUrl}`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyToClipboard}
        aria-label="Copy blog link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs focus:outline-none focus:ring-1 focus:ring-blue-400/50"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={shareToTwitter}
        aria-label="Share on X (Twitter)"
        className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400/50"
      >
        <FaXTwitter className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={shareToLinkedIn}
        aria-label="Share on LinkedIn"
        className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#0a66c2] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400/50"
      >
        <FaLinkedinIn className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={shareToWhatsApp}
        aria-label="Share on WhatsApp"
        className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#25D366] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400/50"
      >
        <FaWhatsapp className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
