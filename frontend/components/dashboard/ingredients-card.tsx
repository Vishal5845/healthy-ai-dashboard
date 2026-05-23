import { Meal } from "@/types/recommendation";

interface Props {
  meal?: Meal;
}

export function IngredientsCard({
  meal,
}: Props) {

  if (!meal) {
    return (
      <div className="p-6 text-white/50">
        No ingredients available.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="mb-2 text-sm text-white/60">
          Ingredients
        </p>
        <h2 className="text-2xl font-bold">
          Meal Composition
        </h2>
      </div>
      <div className="space-y-3">
        {meal.ingredients.map((ingredient) => (
          <div
            key={ingredient.name}
            className="
              flex items-center justify-between
              rounded-2xl
              border border-white/10
              bg-white/5
              p-4
            "
          >
            <div>
              <p className="font-medium">
                {ingredient.name}
              </p>
              <p className="text-sm text-white/50">
                {ingredient.quantity}
              </p>
            </div>
            <div className="text-sm text-white/70">
              {ingredient.calories} cal
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}