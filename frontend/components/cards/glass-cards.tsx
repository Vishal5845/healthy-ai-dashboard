import { cn } from "@/lib/utils/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({
  children,
  className,
}: Props) {

  return (
    <div
      className={cn(
        `
          relative overflow-hidden
          rounded-[32px]
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          shadow-[0_8px_40px_rgba(0,0,0,0.35)]
          transition-all duration-300
          hover:border-white/20
          hover:bg-white/[0.07]
        `,
        className
      )}
    >
      {children}
    </div>
  );
}