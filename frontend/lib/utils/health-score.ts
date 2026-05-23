import { Meal } from "@/types/recommendation";

export function calculateHealthScore(
  meal?: Meal
): number {

  if (!meal) return 0;
  let score = 50;
  const protein =
    meal.macronutrients.protein;
  const fiber =
    meal.micronutrients.fiber_g;
  const fat =
    meal.macronutrients.fat;
  const calories =
    meal.total_calories;
  if (protein >= 25) score += 15;
  if (fiber >= 8) score += 15;
  if (fat <= 20) score += 10;
  if (
    calories >= 300 &&
    calories <= 700
  ) {
    score += 10;
  }
  if (meal.warnings?.length) {
    score -= meal.warnings.length * 5;
  }
  return Math.max(
    0,
    Math.min(score, 100)
  );
}