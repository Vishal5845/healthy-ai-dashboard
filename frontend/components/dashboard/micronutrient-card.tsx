import { Meal } from "@/types/recommendation";
import { ProgressBar } from "@/components/ui/progress-bar";

interface Props {
  meal?: Meal;
}

export function MicronutrientCard({
  meal,
}: Props) {
  if (!meal) {
    return (
      <div className="p-6 text-white/50">
        No micronutrient data available.
      </div>
    );
  }

  const micro = meal.micronutrients;

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="mb-2 text-sm text-white/60">
          Micronutrients
        </p>
        <h2 className="text-2xl font-bold">
          Nutrition Coverage
        </h2>
      </div>
      <div className="space-y-5">
        <ProgressBar
          label="Iron"
          value={micro.iron_mg}
          max={18}
          unit="mg"
        />
        <ProgressBar
          label="Calcium"
          value={micro.calcium_mg}
          max={1000}
          unit="mg"
        />
        <ProgressBar
          label="Fiber"
          value={micro.fiber_g}
          max={35}
          unit="g"
        />
        <ProgressBar
          label="Vitamin D"
          value={micro.vitamin_d_mcg}
          max={15}
          unit="mcg"
        />
        <ProgressBar
          label="Vitamin B12"
          value={micro.vitamin_b12_mcg}
          max={2.4}
          unit="mcg"
        />
      </div>
    </div>
  );
}