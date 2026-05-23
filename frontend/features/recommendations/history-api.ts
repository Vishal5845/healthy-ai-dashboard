import { apiClient } from "@/lib/api/client";

import {
  RecommendationHistoryItem,
} from "@/types/recommendation";


interface HistoryResponse {
  success: boolean;
  history: RecommendationHistoryItem[];
}


export async function fetchHistory(
  userId: string
) {

  const response =
    await apiClient.get<HistoryResponse>(
      `/history/${userId}`
    );

  return response.data.history;
}