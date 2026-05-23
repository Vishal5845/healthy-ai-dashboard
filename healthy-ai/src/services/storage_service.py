import json
from pathlib import Path
from datetime import datetime
import uuid

DATA_FILE = Path(
    "data/recommendations.json"
)


class StorageService:
    def __init__(self):
        if not DATA_FILE.exists():
            DATA_FILE.write_text("[]")

    def load_recommendations(self):
        with open(DATA_FILE, "r") as file:
            return json.load(file)

    def save_recommendation(
        self,
        dietary_needs,
        calories,
        recommendation,
        user_id
    ):
        recommendations = self.load_recommendations()
        document = {
            "id": str(
                uuid.uuid4()
            ),
            "timestamp":
                datetime.utcnow().isoformat(),
            "dietary_needs":
                dietary_needs,
            "calories":
                calories,
            "user_id":
                user_id,
            "recommendation":
                recommendation,
        }

        recommendations.insert(0, document)
        with open(DATA_FILE, "w") as file:
            json.dump(
                recommendations,
                file,
                indent=2
            )

    def get_user_history(
        self,
        user_id
    ):
        recommendations = self.load_recommendations()

        return [
                item
                for item in recommendations
                if item["user_id"] == user_id
            ]
    
    def delete_recommendation(
        self,
        item_id: str
    ):
        recommendations = self.load_recommendations()
        filtered = [
            item
            for item in recommendations
            if item["id"] != item_id
        ]

        if len(filtered) == len(recommendations):
            return False

        with open(
            DATA_FILE,
            "w"
        ) as file:
            json.dump(
                filtered,
                file,
                indent=2
            )

        return True

storage_service = StorageService()