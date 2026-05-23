"use client";

import { useState } from "react";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { fetchRecommendation } from "@/features/recommendations/api";
import { RecommendationResponse } from "@/types/recommendation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { BentoGrid } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/cards/glass-cards";
import { RecommendationForm } from "@/components/dashboard/recommendation-form";
import { RecommendationResult } from "@/components/dashboard/recommendation-result";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MacroChart } from "@/components/charts/macro-chart";
import { NutritionInsights } from "@/components/dashboard/nutrition-insights";
import { IngredientsCard } from "@/components/dashboard/ingredients-card";
import { MicronutrientCard } from "@/components/dashboard/micronutrient-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { ErrorCard } from "@/components/ui/error-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AIInsightPanel } from "@/components/dashboard/ai-insight-panel";
import { fetchHistory } from "@/features/recommendations/history-api";
import { HistorySidebar } from "@/components/dashboard/history-sidebar";
import { getUserId } from "@/utils/user-id";

export default function HomePage() {
  const userId = getUserId();
  const queryClient = useQueryClient();
  const [
    selectedMeal,
    setSelectedMeal
  ] = useState<
    RecommendationResponse | null
  >(null);
  const mutation = useMutation<
    RecommendationResponse,
    Error,
    {
      dietary_needs: string;
      calories: number;
      user_id: string;
    }
  >({
    mutationFn: fetchRecommendation,
    onSuccess: (data) => {
      setSelectedMeal(data);
      queryClient.invalidateQueries({
        queryKey: ['history'],
      });
    }, 
  });

  function handleGenerate(
    dietaryNeeds: string,
    calories: number
  ) {

    mutation.mutate({
      dietary_needs: dietaryNeeds,
      calories,
      user_id: userId,
    });
  }
  const meal = selectedMeal?.meal;
  const historyQuery = useQuery({
    queryKey: ["history"],
    queryFn: () =>
    fetchHistory(userId),
  });

  return (
    <DashboardShell>
      <DashboardHeader />
      {meal && (
        <GlassCard className="mb-6">
          <AIInsightPanel meal={meal} />
        </GlassCard>
      )}
      <BentoGrid>
        <GlassCard className="md:col-span-4">
          <RecommendationForm
            onSubmit={handleGenerate}
            isLoading={mutation.isPending}
          />
        </GlassCard>
        <GlassCard className="md:col-span-8 min-h-[320px]">
          {mutation.isPending ? (
            <SkeletonCard />
          ) : mutation.isError ? (
            <ErrorCard
              message={mutation.error.message}
            />
          ) : (
            meal ? (
              <RecommendationResult meal={meal} />
            ) : (
              <EmptyState />
            )
          )}
        </GlassCard>
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          <MetricCard
            label="Calories"
            value={meal?.total_calories ?? 0}
          />
          <MetricCard
            label="Protein"
            value={meal?.macronutrients.protein ?? 0}
            suffix="g"
          />
          <MetricCard
            label="Carbs"
            value={meal?.macronutrients.carbs ?? 0}
            suffix="g"
          />
          <MetricCard
            label="Fat"
            value={meal?.macronutrients.fat ?? 0}
            suffix="g"
          />
        </div>
        <GlassCard className="md:col-span-6">
          <MacroChart
            protein={
              meal?.macronutrients.protein ?? 0
            }
            carbs={
              meal?.macronutrients.carbs ?? 0
            }
            fat={
              meal?.macronutrients.fat ?? 0
            }
          />
        </GlassCard>
        <GlassCard className="md:col-span-6">
          <NutritionInsights meal={meal} />
        </GlassCard>
        <GlassCard className="md:col-span-6">
          <IngredientsCard meal={meal} />
        </GlassCard>
        <GlassCard className="md:col-span-6">
          <MicronutrientCard meal={meal} />
        </GlassCard>
        <GlassCard className="md:col-span-6 h-[520px] overflow-hidden">
          <HistorySidebar
            items={historyQuery.data ?? []}
            onSelect={(item) => {
              setSelectedMeal(
                item.recommendation
              );
            }}
          />
        </GlassCard>
      </BentoGrid>
    </DashboardShell>
  );
}