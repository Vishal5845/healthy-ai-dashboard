"""Food recommendation CLI command"""

import click
from dotenv import load_dotenv

from src.ai.gemini_client import FoodAIClient

# Load environment variables
load_dotenv()


@click.command()
@click.option(
    '--dietary-needs',
    prompt='Your dietary needs',
    help='e.g., vegetarian, vegan, gluten-free'
)
@click.option(
    '--calories',
    type=int,
    prompt='Target calories',
    help='Daily calorie goal'
)
def recommend(dietary_needs: str, calories: int):
    """Get personalized food recommendations using Google Gemini"""

    try:

        # Validate input FIRST
        if calories <= 0:
            raise ValueError("Calories must be positive")

        click.echo(
            f"\n[SEARCHING] Getting recommendations for "
            f"{dietary_needs} diet with {calories} calories...\n"
        )

        # Initialize Gemini client
        ai_client = FoodAIClient()

        # Get recommendation
        recommendation = ai_client.get_recommendation(
            dietary_needs,
            calories
        )

        # Print response
        click.echo("\n" + "=" * 60)
        click.echo("MEAL RECOMMENDATION")
        click.echo("=" * 60)
        click.echo(recommendation)
        click.echo("=" * 60 + "\n")

        click.echo("[OK] Recommendation generated successfully.\n")

    except ValueError as e:
        click.echo(f"Invalid input: {e}", err=True)

    except RuntimeError as e:
        click.echo(f"API error: {e}", err=True)

    except Exception as e:
        click.echo(f"Unexpected error: {e}", err=True)