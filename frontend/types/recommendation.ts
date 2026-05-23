export interface RecommendationRequest {
  dietary_needs: string;
  calories: number;
  user_id?: string;
}

export interface Macronutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Micronutrients {
  iron_mg: number;
  calcium_mg: number;
  vitamin_b12_mcg: number;
  fiber_g: number;
  vitamin_d_mcg: number;
}

export interface Ingredient {
  name: string;
  quantity: string;
  calories: number;
}

export interface Meal {
  meal_name: string;
  diet_type: string;
  total_calories: number;

  macronutrients: Macronutrients;
  micronutrients: Micronutrients;

  ingredients: Ingredient[];
  benefits: string[];
  warnings: string[];
  meal_tags: string[];
}

export interface RecommendationResponse {
  success: boolean;
  source: string;
  meal: Meal;
}

export interface RecommendationHistoryItem {
  id: string;
  timestamp: string;
  dietary_needs: string;
  calories: number;
  user_id: string;

  recommendation: RecommendationResponse;
}