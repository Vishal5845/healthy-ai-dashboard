import { Meal } from "@/types/recommendation";

interface Props {
  meal?: Meal;
}

export function NutritionInsights({
  meal,
}: Props) {

  if (!meal) {
    return (
      <div className="p-6 text-white/50">
        No nutrition insights available.
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-6">
        <p className="mb-2 text-sm text-white/60">
          AI Insights
        </p>

        <h2 className="text-2xl font-bold">
          Nutrition Benefits
        </h2>
      </div>

      <div className="space-y-4">

        {meal.benefits.map((benefit) => (
          <div
            key={benefit}
            className="
              rounded-2xl
              border border-white/10
              bg-white/5
              p-4 text-sm text-white/80
            "
          >
            {benefit}
          </div>
        ))}

      </div>

    </div>
  );
}