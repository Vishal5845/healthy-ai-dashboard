"use client";

import {
  RecommendationHistoryItem
} from "@/types/recommendation";

import { Trash2 } from "lucide-react";

import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import {
  deleteHistoryItem
} from "@/features/recommendations/delete-history";

interface Props {
  items: RecommendationHistoryItem[];

  onSelect: (
    item: RecommendationHistoryItem
  ) => void;
}

export function HistorySidebar({
  items,
  onSelect,
}: Props) {

  const queryClient =
    useQueryClient();

  const deleteMutation =
    useMutation({

      mutationFn:
        deleteHistoryItem,

      onSuccess: () => {

        queryClient
          .invalidateQueries({
            queryKey: ["history"],
          });
      },
    });

  return (

    <div className="flex h-full flex-col p-6">

      <div className="mb-6 shrink-0">

        <p className="mb-2 text-sm text-white/60">
          Recommendation History
        </p>

        <h2 className="text-2xl font-bold">
          Recent Meals
        </h2>

      </div>

      <div
        className="
          flex-1
          overflow-y-auto
          space-y-4
          pr-2
          min-h-0
        "
      >

        {items.length === 0 ? (

          <div className="text-white/50">
            No history available.
          </div>

        ) : (

          items.map((item) => {

            const meal =
              item.recommendation.meal;

            return (
              <div
                key={`${item.id}-${item.timestamp}`}
                onClick={() =>
                  onSelect(item)
                }
                className="
                  w-full
                  cursor-pointer
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  p-4
                  text-left
                  transition
                  hover:bg-white/10
                "
              >
                <div
                  className="
                    mb-2 flex
                    items-center
                    justify-between
                  "
                >
                  <h3 className="font-semibold">
                    {meal.meal_name}
                  </h3>
                  <span
                    className="
                      text-xs
                      text-white/40
                    "
                  >
                    {item.calories} cal
                  </span>
                </div>
                <p
                  className="
                    mb-2 text-sm
                    text-white/60
                  "
                >
                  {meal.diet_type}
                </p>
                <p
                  className="
                    text-xs
                    text-white/40
                  "
                >
                  {new Date(
                    item.timestamp
                  ).toLocaleString()}
                </p>
                <div
                  className="
                    mt-4 flex
                    justify-end
                  "
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(item.id);
                    }}
                    className="
                      rounded-xl
                      border
                      border-red-500/20
                      p-2
                      text-red-400
                      transition
                      hover:bg-red-500/10
                    "
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}