"""A simple CLI simulation of a Planning Poker estimation session.

Three mock developers each vote on the story points for a task, using the
Fibonacci sequence (1, 2, 3, 5, 8, 13). If all votes agree, the team has
reached consensus. Otherwise, the average of the votes is shown as a
suggestion and the developers "re-vote" (their next guess is nudged toward
the average) for a fixed number of rounds, mimicking real Planning Poker
discussion-and-revote rounds.
"""

import random

FIBONACCI = [1, 2, 3, 5, 8, 13]
DEVELOPERS = ["Alice", "Bob", "Charlie"]
MAX_ROUNDS = 3


def nearest_fibonacci(value):
    """Round a number to the closest allowed Fibonacci value."""
    return min(FIBONACCI, key=lambda point: abs(point - value))


def cast_votes(previous_average=None):
    """Simulate one round of voting.

    On the first round, each developer picks a random Fibonacci value.
    On later rounds (previous_average is not None), votes are biased
    toward the previous round's average, simulating developers converging
    after discussion.
    """
    votes = {}
    for developer in DEVELOPERS:
        if previous_average is None:
            votes[developer] = random.choice(FIBONACCI)
        else:
            anchor = nearest_fibonacci(previous_average)
            anchor_index = FIBONACCI.index(anchor)
            spread = 1  # after discussion, votes should be close to the anchor
            low = max(0, anchor_index - spread)
            high = min(len(FIBONACCI) - 1, anchor_index + spread)
            votes[developer] = FIBONACCI[random.randint(low, high)]
    return votes


def has_consensus(votes):
    """True if every developer voted the same number of points."""
    return len(set(votes.values())) == 1


def average_of(votes):
    return sum(votes.values()) / len(votes)


def print_votes(round_number, votes):
    print(f"\n--- Round {round_number} ---")
    for developer, points in votes.items():
        print(f"  {developer}: {points}")


def run_session(task_title):
    print(f"Planning Poker session for task: '{task_title}'")

    previous_average = None
    for round_number in range(1, MAX_ROUNDS + 1):
        votes = cast_votes(previous_average)
        print_votes(round_number, votes)

        if has_consensus(votes):
            points = next(iter(votes.values()))
            print(f"\nConsensus reached: {points} story points.")
            return points

        average = average_of(votes)
        suggestion = nearest_fibonacci(average)
        print(f"No consensus. Average: {average:.1f} (nearest Fibonacci: {suggestion})")
        previous_average = average

    print(
        f"\nNo consensus after {MAX_ROUNDS} rounds. "
        f"Falling back to nearest Fibonacci average: {suggestion} story points."
    )
    return suggestion


def main():
    task_title = input("Enter the task title to estimate: ").strip() or "Untitled task"
    run_session(task_title)


if __name__ == "__main__":
    main()
