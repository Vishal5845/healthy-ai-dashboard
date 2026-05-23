"use client";

import { motion } from "framer-motion";
import { Meal } from "@/types/recommendation";
import { MealTags } from "@/components/dashboard/meal-tags";

interface Props {
  meal?: Meal;
}

export function RecommendationResult({
  meal,
}: Props) {

  if (!meal) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-white/50">
        Generate a recommendation to see results.
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="p-6"
    >
      <div className="mb-6">
        <p className="mb-2 text-sm text-white/60">
          Recommended Meal
        </p>
        <h2 className="text-3xl font-bold">
          {meal.meal_name}
        </h2>
      </div>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">
            Calories
          </span>
          <span>
            {meal.total_calories}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">
            Protein
          </span>
          <span>
            {meal.macronutrients.protein}g
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">
            Carbs
          </span>
          <span>
            {meal.macronutrients.carbs}g
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">
            Fat
          </span>
          <span>
            {meal.macronutrients.fat}g
          </span>
        </div>
      </div>
      <MealTags tags={meal.meal_tags} />
    </motion.div>
  );
}