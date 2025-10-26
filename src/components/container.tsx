import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "wide";
}

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-4xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    wide: "max-w-[1200px]",
  };

  return (
    <div className={cn("mx-auto px-4 sm:px-6", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

export default Container;
