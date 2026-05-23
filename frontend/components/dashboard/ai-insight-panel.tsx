import { Meal } from "@/types/recommendation";
import { calculateHealthScore } from "@/lib/utils/health-score";

interface Props {
  meal?: Meal;
}

export function AIInsightPanel({
  meal,
}: Props) {

  if (!meal) {
    return null;
  }

  const score = calculateHealthScore(meal);

  const verdict =
    score >= 85
      ? "Excellent nutritional balance."
      : score >= 70
      ? "Well-balanced healthy recommendation."
      : score >= 50
      ? "Moderately healthy meal."
      : "Needs nutritional improvement.";

  return (
    <div
      className="
        relative overflow-hidden
        p-8
      "
    >
      <div
        className="
          absolute right-0 top-0
          h-48 w-48
          rounded-full
          bg-violet-500/20
          blur-[80px]
        "
      />
      <div className="relative z-10">
        <p className="mb-3 text-sm text-violet-300">
          AI Nutrition Intelligence
        </p>
        <h2 className="mb-4 text-4xl font-bold">
          Health Score: {score}/100
        </h2>
        <p className="mb-8 max-w-2xl text-lg text-white/70">
          {verdict}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="
              rounded-2xl
              border border-white/10
              bg-white/5
              p-5
            "
          >
            <p className="mb-2 text-sm text-white/50">
              Key Benefits
            </p>
            <div className="space-y-2">
              {meal.benefits
                ?.slice(0, 3)
                .map((benefit) => (
                  <div
                    key={benefit}
                    className="text-sm text-white/80"
                  >
                    • {benefit}
                  </div>
                ))}
            </div>
          </div>
          <div
            className="
              rounded-2xl
              border border-white/10
              bg-white/5
              p-5
            "
          >
            <p className="mb-2 text-sm text-white/50">
              Considerations
            </p>
            <div className="space-y-2">
              {meal.warnings?.length ? (
                meal.warnings
                  .slice(0, 3)
                  .map((warning) => (
                    <div
                      key={warning}
                      className="text-sm text-yellow-200"
                    >
                      • {warning}
                    </div>
                  ))
              ) : (
                <div className="text-sm text-green-300">
                  No major concerns detected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}