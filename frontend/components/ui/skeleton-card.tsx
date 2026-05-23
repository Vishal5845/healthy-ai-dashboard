export function SkeletonCard() {
  return (
    <div
      className="
        animate-pulse
        rounded-[32px]
        border border-white/10
        bg-white/5
        p-6
      "
    >
      <div className="mb-6 h-5 w-32 rounded bg-white/10" />
      <div className="mb-4 h-10 w-52 rounded bg-white/10" />
      <div className="space-y-3">
        <div className="h-4 rounded bg-white/10" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-4/6 rounded bg-white/10" />
      </div>
    </div>
  );
}