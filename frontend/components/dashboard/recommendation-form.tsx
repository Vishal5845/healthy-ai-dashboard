"use client"

import { useState } from "react";

interface Props {
  // Define your props here
  onSubmit: (
    dietary_needs: string,
    calories: number
  ) => void;

  isLoading? : boolean;
}

export function RecommendationForm({onSubmit, isLoading}: Props) {
    const [dietaryNeeds, setDietaryNeeds] = useState("veg");
    const [calories, setCalories] = useState(400);

    return (
    <div className="flex h-full flex-col p-6">
        <div className="mb-8">
            <p className="mb-2 text-sm text-white/60">
                AI Meal Generator
            </p>
            <h2 className="text-2xl font-semibold">
                Generate Recommendation
            </h2>
        </div>
        <div className="space-y-5">
            <div>
                <label className="mb-2 block text-sm text-white/70">
                    Dietary Preference
                </label>
                <select value={dietaryNeeds} onChange={(e) => setDietaryNeeds(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-lg">
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="high-protein">High Protein</option>
                </select>
            </div>
            <div>
                <label className="mb-2 block text-sm text-white/70">
                    Calories
                </label>
                <input 
                type="number"
                value={calories}
                onChange={(e) =>
                    setCalories(Number(e.target.value))
                }
                className="
                w-full rounded-2xl border border-white/10
                bg-white/5 px-4 py-3 text-white
                outline-none backdrop-blur-lg"
                min={200}
                max={2000}
                />
            </div>
            <button
                onClick={() =>
                    onSubmit(dietaryNeeds, calories)
                }
                disabled={isLoading}
                className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-medium transition-all hover:bg-violet-500 disabled:opacity-50"
            >
                {isLoading
                    ? "Generating..."
                    : "Generate Meal"}
            </button>
        </div>
    </div>
);
}
