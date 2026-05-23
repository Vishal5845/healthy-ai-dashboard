import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY =
  "healthy-ai-user-id";

export function getUserId() {
  if (typeof window === "undefined") {
    return "server-user";
  }

  let userId =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(
      STORAGE_KEY,
      userId
    );
  }

  return userId;
}