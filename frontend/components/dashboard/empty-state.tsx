import { Sparkles } from "lucide-react";

export function EmptyState() {

  return (
    <div
      className="
        flex h-full flex-col
        items-center justify-center
        p-10 text-center
      "
    >

      <div
        className="
          mb-6 flex h-16 w-16
          items-center justify-center
          rounded-full
          bg-violet-500/20
        "
      >
        <Sparkles className="h-8 w-8 text-violet-300" />
      </div>
      <h2 className="mb-3 text-2xl font-bold">
        Generate Your First Meal
      </h2>
      <p className="max-w-md text-white/60">
        AI-powered nutrition insights,
        macro analysis, ingredients,
        and personalized recommendations
        will appear here.
      </p>
    </div>
  );
}