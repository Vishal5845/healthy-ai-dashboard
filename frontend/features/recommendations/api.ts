import { apiClient } from "@/lib/api/client";

import {
  RecommendationRequest,
  RecommendationResponse,
} from "@/types/recommendation";

export async function fetchRecommendation(
  payload: RecommendationRequest
): Promise<RecommendationResponse> {

  const response = await apiClient.post(
    "/recommend",
    payload
  );

  return response.data;
}