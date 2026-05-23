import {apiClient} from "@/lib/api/client";

export async function deleteHistoryItem(
  itemId: string
) {
  const response =
    await apiClient.delete(
      `/history/${itemId}`
    );
  return response.data;
}