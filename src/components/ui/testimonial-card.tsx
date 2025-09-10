import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

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
}

export function TestimonialCard({
  author,
  text,
  href,
  className,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-2xl border border-blue-500/10",
        "bg-blue-900/5 hover:bg-blue-900/10 backdrop-blur-sm",
        "p-6 text-start sm:p-8",
        "w-[380px] h-[200px] flex-shrink-0",
        "text-white transition-colors duration-300",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight">
            {author.name}
          </h3>
          <p className="text-sm text-white/60 mt-1">{author.handle}</p>
        </div>
      </div>
      <p className="text-sm text-white/70 mt-4 leading-relaxed line-clamp-4">
        {text}
      </p>
    </Card>
  );
}
