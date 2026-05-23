"""Google Gemini client for AI-powered food recommendations (FREE API)"""
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()


class FoodAIClient:
    """Client for Google Gemini-powered food recommendations using REST API"""
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        self.demo_mode = not bool(self.api_key)

        if self.demo_mode:
            print("Running in DEMO MODE (Gemini disabled)")
        # Use gemini-2.5-flash (latest model) or fall back to demo mode
        self.base_url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"
    
    # Public Methods
    def get_recommendation(self, dietary_needs: str, calories: int) -> dict:
        dietary_needs, calories = self._validate_inputs(
            dietary_needs,
            calories
        )
        prompt = self.build_recommendation_prompt(dietary_needs, calories)
        if self.demo_mode:
            return {
                "success": True,
                "source": "demo",
                "meal": self._demo_recommendation(dietary_needs, calories)
            }
        
        try:
            return self._call_with_retry(prompt, calories)
        except Exception as e:
            return self._handle_fallback(e, dietary_needs, calories)
            
    
    def analyze_nutrition(self, food_description: str) -> dict:
        if not food_description or len(food_description.strip()) < 3:
            raise ValueError("Food description is too short.")
        
        prompt = self._build_analysis_prompt(food_description)
        
        if self.demo_mode:
            return {
                "success": True,
                "source": "demo",
                "analysis": self._demo_analysis(food_description)
            }
        try:
            res = self._call_llm(prompt)
            parsed = self._parse_response(res)

            return {
                "success": True,
                "source": "gemini",
                "analysis": parsed
            }
        except Exception as e:
            print(f"Nutrition analysis fallback triggered: {e}")

            return {
                "success": True,
                "source": "demo",
                "analysis": self._demo_analysis(food_description)
            }

    def _parse_response(self, response: str) -> dict:
        try:
            return json.loads(response)

        except json.JSONDecodeError:
            repaired = self._repair_json(response)
            return json.loads(repaired)

    def _repair_json(self, bad_response: str) -> str:
        repair_prompt = f"""
            You are a strict JSON repair tool.

            You MUST return ONLY valid JSON.
            No explanations.
            No markdown.
            Return ONLY valid JSON.
            Do not add explanations.
            {bad_response}
        """
        return self._call_llm(repair_prompt)

    def _validate_response(self, data, target_calories) -> dict:
        if "total_calories" not in data:
            raise ValueError("Missing calories")
        if abs(data["total_calories"] - target_calories) > target_calories * 0.1:
            raise ValueError("Calories out of acceptable range")

        return data
    
    # Core Logic
    def _call_with_retry(self, prompt, calories: int, retries: int=2) -> dict:
        for i in range(retries):
            res = self._call_llm(prompt)
            parsed = self._parse_response(res)

            try:
                validated = self._validate_response(parsed, calories)

                return {
                    "success": True,
                    "source": "gemini",
                    "meal": validated
                }

            except Exception as e:
                print(f"Validation failed on retry {i+1}: {e}")
                if i == retries - 1:
                    raise
                

        raise ValueError("Failed after retries")
    
    def _generate_content(self, prompt: str) -> str:
        """Make API request to Gemini"""
        headers = {"Content-Type": "application/json"}
        
        data = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        
        params = {"key": self.api_key}
        
        response = requests.post(
            self.base_url,
            headers=headers,
            json=data,
            params=params,
            timeout=30
        )
        
        if response.status_code != 200:
            try:
                error_data = response.json()
            except:
                error_data = response.text
            raise RuntimeError(f"Gemini API failed: {error_data}")
        
        result = response.json()

        # Safe parsing
        try:
            candidates = result.get("candidates")
            if not candidates:
                raise ValueError("No candidates in response")
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if not parts:
                raise ValueError("No content parts found")
            text = parts[0].get("text")
            if not text or not text.strip():
                raise RuntimeError("Empty response from Gemini API")

            return text.strip()
        except (KeyError, IndexError) as e:
            raise Exception(f"Invalid API response format: {result}")
        
    def _call_llm(self, prompt: str) -> str:
        return self._generate_content(prompt)
    
    # Prompt Builders
    def build_recommendation_prompt(self, dietary_type: str, calories: int) -> str:
        if dietary_type == "vegetarian":
            diet_rules = """
                - Use vegetarian ingredients only.
                - Include Vitamin B12 via fortified foods or supplements.
                - Pair iron sources with Vitamin C for absorption.
                """
        elif dietary_type == "vegan":
            diet_rules = """
                - Use strictly plant-based ingredients.
                - Vitamin B12 must come from fortified foods or supplements.
                - Ensure omega-3 (ALA sources like flax/chia).
                - Pair iron with Vitamin C.
                """
        else:  # non_vegetarian
            diet_rules = """
                - Include animal-based protein sources if beneficial.
                - Prefer lean meats, eggs, or fish.
                - Ensure balanced fat intake (avoid excessive saturated fat).
                - Include diverse micronutrients naturally from animal + plant sources.
                """

        return f"""
            You are a STRICT JSON API.

            You MUST return ONLY valid JSON.
            No markdown. No explanations. No text.

            If you fail, the response will be rejected.

            IMPORTANT RULES:
            - Output must be valid JSON (json.loads compatible)
            - No trailing commas
            - No comments
            - No units in numbers
            - total_calories MUST be within ±5% of target
            - If not, regenerate internally before responding

            DIET RULES:
            {diet_rules}

            OUTPUT FORMAT (STRICT JSON):

            {{
            "meal_name": "string",
            "diet_type": "{dietary_type}",
            "total_calories": {calories},
            "macronutrients": {{
                "protein": 0,
                "carbs": 0,
                "fat": 0
            }},
            "micronutrients": {{
                "iron_mg": 0,
                "calcium_mg": 0,
                "vitamin_b12_mcg": 0,
                "fiber_g": 0,
                "vitamin_d_mcg": 0
            }},
            "ingredients": [
                {{
                "name": "string",
                "quantity": "string",
                "calories": 0
                }}
            ],
            "benefits": ["string"],
            "warnings": ["string"],
            "meal_tags": ["string"]
            }}

            Return ONLY JSON.
            
        """

    def _build_analysis_prompt(self, food_description):
        return f"""
            You are a STRICT JSON API.

            Return ONLY valid JSON.

            {{
            "food": "{food_description}",
            "calories": number,
            "macronutrients": {{
                "protein": number,
                "carbs": number,
                "fat": number
            }},
            "micronutrients": {{
                "iron_mg": number,
                "calcium_mg": number,
                "fiber_g": number
            }},
            "benefits": ["string"]
            }}
        """
    # Validation 
    def _validate_inputs(self, dietary_needs, calories):
        dietary_needs = dietary_needs.lower().strip()

        mapping = {
            "veg": "vegetarian",
            "vegetarian": "vegetarian",

            "vegan": "vegan",

            "nonveg": "non_vegetarian",
            "non-veg": "non_vegetarian",
            "non vegetarian": "non_vegetarian",

            "high-protein": "high_protein",
            "high protein": "high_protein",

            "keto": "keto",
        }

        dietary_needs = mapping.get(dietary_needs)

        if not dietary_needs:
            raise ValueError("Unsupported dietary type")
        if not dietary_needs or len(dietary_needs.strip()) < 3:
            raise ValueError("Invalid dietary needs input")
        
        if not isinstance(calories,int) or calories<=0:
            raise ValueError("Calories must be a positive integer")
        
        return dietary_needs, calories
        
    # Fallback Handling
    def _handle_fallback(self, error, dietary_needs, calories):
        print(f"Gemini fallback triggered: {error}")

        return {
            "success": True,
            "source": "demo",
            "meal": self._demo_recommendation(
                dietary_needs,
                calories
            )
        }
    
    # Demo Data
    def _demo_recommendation(self, dietary_needs: str, calories: int):
        diet = (
            dietary_needs.lower()
            if dietary_needs
            else "veg"
        )

        meals = {
            "veg": {
                "meal_name":
                    "Mediterranean Power Bowl",

                "ingredients": [
                    {
                        "name": "Quinoa",
                        "quantity": "1 cup",
                        "calories": 220
                    },
                    {
                        "name": "Chickpeas",
                        "quantity": "1 cup",
                        "calories": 270
                    },
                    {
                        "name": "Mixed Vegetables",
                        "quantity": "1 cup",
                        "calories": 150
                    },
                    {
                        "name": "Olive Oil",
                        "quantity": "1 tbsp",
                        "calories": 120
                    }
                ],

                "tags": [
                    "Vegetarian",
                    "Balanced",
                    "High-Fiber"
                ]
            },

            "high_protein": {
                "meal_name":
                    "Protein Recovery Plate",

                "ingredients": [
                    {
                        "name": "Paneer",
                        "quantity": "200g",
                        "calories": 320
                    },
                    {
                        "name": "Brown Rice",
                        "quantity": "1 cup",
                        "calories": 210
                    },
                    {
                        "name": "Greek Yogurt",
                        "quantity": "1 bowl",
                        "calories": 140
                    }
                ],

                "tags": [
                    "High-Protein",
                    "Muscle Gain",
                    "Recovery"
                ]
            },

            "vegan": {
                "meal_name":
                    "Vegan Energy Bowl",

                "ingredients": [
                    {
                        "name": "Tofu",
                        "quantity": "200g",
                        "calories": 180
                    },
                    {
                        "name": "Sweet Potato",
                        "quantity": "1 medium",
                        "calories": 160
                    },
                    {
                        "name": "Spinach",
                        "quantity": "1 cup",
                        "calories": 40
                    }
                ],

                "tags": [
                    "Vegan",
                    "Plant-Based",
                    "Clean Eating"
                ]
            }
        }
        selected = meals.get(diet, meals["veg"])
        protein = int(calories * 0.2 / 4)
        carbs = int(calories * 0.5 / 4)
        fat = int(calories * 0.3 / 9)
        return {
            "meal_name": selected["meal_name"],
            "diet_type": diet,
            "total_calories": calories,
            "macronutrients": {
                "protein": protein,
                "carbs": carbs,
                "fat": fat
            },
            "micronutrients": {
                "iron_mg": 18,
                "calcium_mg": 800,
                "vitamin_b12_mcg": 2.4,
                "fiber_g": 30,
                "vitamin_d_mcg": 10
            },
            "ingredients": selected["ingredients"],
            "benefits": [
                "Balanced macro distribution",
                "Supports sustained energy",
                "Rich in essential nutrients"
            ],
            "warnings": [
                "Adjust portions based on activity level"
            ],
            "meal_tags": selected["tags"]
        }
    
    def _demo_analysis(self, food_description: str):
        return {
            "food": food_description,
            "calories": 400,
            "macronutrients": {
                "protein": 20,
                "carbs": 45,
                "fat": 12
            },
            "micronutrients": {
                "iron_mg": 4,
                "calcium_mg": 150,
                "fiber_g": 5
            },
            "benefits": [
                "Provides sustained energy",
                "Supports muscle recovery",
                "Contains essential vitamins"
            ]
        }