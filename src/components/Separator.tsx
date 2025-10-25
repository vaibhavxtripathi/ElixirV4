import { cn } from "@/lib/utils";

export default function Separator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent",
        className
      )} 
      {...props}
    ></div>
  );
}
