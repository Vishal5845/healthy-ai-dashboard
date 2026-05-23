import { cn } from "@/lib/utils/cn";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({
  children,
  className,
}: GridProps) {

  return (
    <div
      className={cn(
        "grid gap-6 md:grid-cols-12",
        className
      )}
    >
      {children}
    </div>
  );
}