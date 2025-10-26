import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
}

export function PageHeader({ title, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-4 sm:mb-6", className)}>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
        {title}
      </h1>
    </div>
  );
}

export default PageHeader;
