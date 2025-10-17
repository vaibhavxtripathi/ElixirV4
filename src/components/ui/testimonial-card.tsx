import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
  className?: string;
  truncate?: boolean; // New prop to control truncation
}

export function TestimonialCard({
  author,
  text,
  href,
  className,
  truncate = false,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-2xl border border-blue-500/10",
        "bg-blue-900/5 hover:bg-blue-900/10 backdrop-blur-sm",
        "p-6 text-start sm:p-8",
        "w-[380px] flex-shrink-0",
        truncate ? "h-[200px]" : "min-h-[200px]",
        "text-white transition-colors duration-300",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center">
          <img
            src={author.avatar}
            alt={author.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            className="h-full w-full bg-blue-500/20 text-white text-sm font-medium flex items-center justify-center"
            style={{ display: "none" }}
          >
            {author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight">
            {author.name}
          </h3>
          <p className="text-sm text-white/60 mt-1">{author.handle}</p>
        </div>
      </div>
      <p
        className={cn(
          "text-sm text-white/70 mt-4 leading-relaxed",
          truncate ? "line-clamp-3 overflow-hidden" : ""
        )}
      >
        {text}
      </p>
    </Card>
  );
}
