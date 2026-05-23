"""Main CLI entry point"""
import click
from src.cli.recommend import recommend
from src.cli.analyze import analyze
from src.cli.preferences import (
    preferences,
    show_preferences
)
from src.cli.history import (
    history,
    clear_history
)
@click.group()
def cli():
    """Healthy Food AI CLI"""
    pass
# Recommendation commands
cli.add_command(recommend)
cli.add_command(analyze)
# Preference commands
cli.add_command(preferences, name='set-preferences')
cli.add_command(show_preferences, name='show-preferences')
# History commands
cli.add_command(history)
cli.add_command(clear_history, name='clear-history')
if __name__ == "__main__":
    cli()