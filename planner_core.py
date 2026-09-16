"""Core data model and persistence for sprints and retrospective cards.

Loads and saves state to state.json.
"""

import json

STATE_FILE = "state.json"

# The three task statuses recognised by the Kanban board (see kanban_cli.py).
# Only "Done" tasks are considered finished work; anything else is still
# in-flight and must not be left dangling on a sprint once it closes.
TASK_STATUSES = ["To Do", "In Progress", "Done"]
# The only categories a retrospective card may use.
RETRO_CATEGORIES = ["Went Well", "To Improve", "Action Item"]
# The lifecycle a sprint moves through, and the only transitions allowed
# between them. A sprint can never move backwards or skip a state.
SPRINT_STATUSES = ["Planning", "Active", "Completed"]
ALLOWED_SPRINT_TRANSITIONS = {
    "Planning": ["Active"],
    "Active": ["Completed"],
    "Completed": [],
}
# The only story point values a task is allowed to use. These come from the
# Fibonacci sequence (each number is the sum of the two before it: 1, 2, 3,
# 5, 8, 13...). Planning Poker uses this scale because it's hard to be
# precise about "is this a 9 or a 10?", so teams round to one of these
# fixed options instead. Anything not in this list (like 4, 6, 7, 9, 10...)
# is not allowed.
VALID_STORY_POINTS = [1, 2, 3, 5, 8, 13]


def validate_task_status(status):
    """Raise ValueError if `status` is not a recognised task column."""
    if status not in TASK_STATUSES:
        raise ValueError(f"Invalid task status '{status}'. Must be one of {TASK_STATUSES}.")

def validate_story_points(story_points):
    """Check that story_points is allowed, and stop the program with an
    error message if it isn't.

    In plain terms: this function is a "bouncer" at the door. Before a
    story point value is allowed into the system, we check it against the
    guest list (VALID_STORY_POINTS). Two things are OK:
      1. story_points is None (meaning "not estimated yet").
      2. story_points is exactly one of 1, 2, 3, 5, 8, or 13.

    Anything else (like 4, 7, 10, "five", or -2) is rejected by raising a
    ValueError, which is Python's way of saying "stop right here, this
    input is invalid". If nothing is raised, the value is valid.
    """
    if story_points is None:
        return  # No estimate yet is fine, nothing more to check.

    if story_points not in VALID_STORY_POINTS:
        raise ValueError(
            f"Invalid story_points '{story_points}'. Must be None or one of "
            f"the Fibonacci values {VALID_STORY_POINTS} (e.g. 4 and 10 are "
            "not allowed)."
        )


def validate_checklist(checklist):
    """Raise ValueError unless checklist is a dict of str -> bool entries."""
    if not isinstance(checklist, dict):
        raise ValueError(f"Invalid checklist '{checklist}'. Must be a dict of item -> bool.")
    for item, value in checklist.items():
        if not isinstance(item, str) or not isinstance(value, bool):
            raise ValueError(f"Invalid checklist entry '{item}': '{value}'. Keys must be strings, values must be bool.")


def validate_retro_category(category):
    """Raise ValueError if `category` is not an allowed retrospective category."""
    if category not in RETRO_CATEGORIES:
        raise ValueError(f"Invalid category '{category}'. Must be one of {RETRO_CATEGORIES}.")


def is_ready_for_sprint(task):
    """Check a task's Definition of Ready (DoR).

    A task is ready to be pulled into a sprint only once it has a DoR
    checklist, that checklist is non-empty, and every item on it is True.
    A task that is already blocked is never ready.
    """
    checklist = task.get("dor_checklist", {})
    if task.get("blocked"):
        return False
    if not checklist:
        return False
    return all(checklist.values())


def is_ready_to_close(task):
    """Check a task's Definition of Done (DoD).

    A task can only be closed (moved to "Done") once it has a DoD
    checklist, that checklist is non-empty, and every item on it is True.
    A blocked task can never be considered done.
    """
    checklist = task.get("dod_checklist", {})
    if task.get("blocked"):
        return False
    if not checklist:
        return False
    return all(checklist.values())


def validate_sprint_transition(current_status, new_status):
    """Raise ValueError if moving a sprint from `current_status` to `new_status` isn't allowed."""
    if new_status not in ALLOWED_SPRINT_TRANSITIONS.get(current_status, []):
        raise ValueError(
            f"Cannot move a sprint from '{current_status}' to '{new_status}'. "
            f"Allowed next state(s): {ALLOWED_SPRINT_TRANSITIONS.get(current_status, [])}."
        )


class Planner:
    def __init__(self):
        self.sprints = []
        self.retrospective_cards = []

        # Registry of all known tasks, keyed by task id.
        # Each entry looks like: {"id": ..., "status": ..., "sprintId": ...}
        # "sprintId" is None when a task is unassigned (i.e. sitting in the
        # backlog) and is set to a sprint's id while that task is assigned
        # to that sprint.
        #
        # NOTE: this registry is what lets complete_sprint() know the real
        # status of each task (To Do / In Progress / Done) — the sprint's
        # own "taskIds" list only stores *which* tasks are assigned to it,
        # not their column/status.
        self.tasks = {}

    def create_sprint(self, id, name, task_ids=None):
        sprint = {
            "id": id,
            "name": name,
            "status": "Planning",
            "taskIds": list(task_ids) if task_ids else [],
        }
        self.sprints.append(sprint)
        return sprint

    def get_sprint(self, sprint_id):
        for sprint in self.sprints:
            if sprint["id"] == sprint_id:
                return sprint

    def start_sprint(self, sprint_id):
        sprint = self.get_sprint(sprint_id)
        if sprint is None:
            raise ValueError(f"Sprint '{sprint_id}' not found.")
        validate_sprint_transition(sprint["status"], "Active")
        active_sprint = next((s for s in self.sprints if s["status"] == "Active"), None)
        if active_sprint is not None and active_sprint["id"] != sprint_id:
            raise ValueError(
                f"Cannot start sprint '{sprint_id}': sprint '{active_sprint['id']}' "
                "is already Active. Complete it first."
            )
        sprint["status"] = "Active"

    def add_task(self, task_id, status="To Do", story_points=None):
        """Register a task in the planner's task registry.

        This is the single source of truth for a task's current column
        (status). Tasks start out unassigned to any sprint (sprintId=None,
        i.e. sitting in the backlog) until add_task_to_sprint() is called.

        New tasks start unblocked, with no blocker reason, and with empty
        Definition of Ready / Definition of Done checklists (item -> bool).
        """
        validate_task_status(status)
        validate_story_points(story_points)
        self.tasks[task_id] = {
            "id": task_id,
            "status": status,
            "sprintId": None,
            "story_points": story_points,
            "blocked": False,
            "blocker_reason": None,
            "dor_checklist": {},
            "dod_checklist": {},
        }
        return self.tasks[task_id]

    def get_task(self, task_id):
        return self.tasks.get(task_id)

    def set_task_status(self, task_id, status):
        """Update a task's column (To Do / In Progress / Done).

        Beginner note: think of this as the one "gatekeeper" function that
        every column move must go through. It runs two checks, in order,
        before it lets the move happen:
          1. Is the task blocked? If so, stop immediately (see
             set_task_blocked/unblock_task) — a blocked task can't move
             anywhere until someone runs unblock_task().
          2. Is the destination "Done"? If so, the task's Definition of
             Done (DoD) checklist must have every item set to True. This
             is checked using the is_ready_to_close() helper function.
        If either check fails, we raise a ValueError, which stops the
        program right there with an explanation instead of letting the
        (invalid) move silently happen.
        """
        task = self.get_task(task_id)
        if task is None:
            raise ValueError(f"Task '{task_id}' not found.")
        if task["blocked"]:
            raise ValueError(
                f"Cannot move task '{task_id}': it is blocked "
                f"(reason: {task['blocker_reason']}). Run unblock_task() first."
            )
        if status == "Done" and not is_ready_to_close(task):
            raise ValueError(
                f"Cannot move task '{task_id}' to 'Done': its dod_checklist "
                "is missing items or has items that are not yet True."
            )
        validate_task_status(status)
        task["status"] = status

    def set_task_story_points(self, task_id, story_points):
        """Set a task's story point estimate (None or a non-negative number)."""
        task = self.get_task(task_id)
        if task is None:
            raise ValueError(f"Task '{task_id}' not found.")
        validate_story_points(story_points)
        task["story_points"] = story_points

    def set_task_blocked(self, task_id, blocked, blocker_reason=None):
        """Flag a task as blocked/unblocked.

        A blocked task must always carry a non-empty blocker_reason so the
        team knows why it's stuck; unblocking a task always clears the
        reason.
        """
        task = self.get_task(task_id)
        if task is None:
            raise ValueError(f"Task '{task_id}' not found.")
        if blocked and not blocker_reason:
            raise ValueError("blocker_reason is required when marking a task as blocked.")
        task["blocked"] = bool(blocked)
        task["blocker_reason"] = blocker_reason if blocked else None

    def unblock_task(self, task_id):
        """The only way to clear a task's blocked flag, allowing it to move again."""
        self.set_task_blocked(task_id, False)

    def update_task_checklist(self, task_id, checklist_name, item, value):
        """Set a single item in a task's 'dor_checklist' or 'dod_checklist'."""
        task = self.get_task(task_id)
        if task is None:
            raise ValueError(f"Task '{task_id}' not found.")
        if checklist_name not in ("dor_checklist", "dod_checklist"):
            raise ValueError("checklist_name must be 'dor_checklist' or 'dod_checklist'.")
        if not isinstance(item, str) or not isinstance(value, bool):
            raise ValueError("Checklist item must be a string and value must be a bool.")
        task[checklist_name][item] = value

    def add_task_to_sprint(self, sprint_id, task_id):
        """Move a task from the Product Backlog into a sprint.

        Beginner note: in Python, "backlog" just means a task that exists
        in self.tasks but has sprintId set to None (see add_task()). This
        function is the only place that's allowed to change that to an
        actual sprint id, and it acts as a gatekeeper with two rules,
        checked in order:
          1. story_points must be a number greater than 0 — meaning the
             task has actually been estimated (e.g. via Planning Poker).
             A value of None or 0 means "not estimated yet", so the move
             is rejected.
          2. Every item in the task's dor_checklist (Definition of Ready)
             must be True. This is checked using the is_ready_for_sprint()
             helper function, which also refuses blocked tasks.
        If either rule isn't met, we raise a ValueError (Python's way of
        stopping the program with an error message) instead of letting an
        unready task quietly slip into the sprint.
        """
        sprint = self.get_sprint(sprint_id)
        if sprint is None:
            raise ValueError(f"Sprint '{sprint_id}' not found.")
        task = self.get_task(task_id)
        if task is None:
            raise ValueError(
                f"Task '{task_id}' not found. Register it with add_task() "
                "and complete its DoR checklist before pulling it into a sprint."
            )

        if not task["story_points"] or task["story_points"] <= 0:
            raise ValueError(
                f"Cannot move task '{task_id}' into sprint '{sprint_id}': it needs a "
                "story_points value greater than 0 (estimate it first, e.g. with Planning Poker)."
            )

        if not is_ready_for_sprint(task):
            raise ValueError(
                f"Cannot move task '{task_id}' into sprint '{sprint_id}': its dor_checklist "
                "is missing items or has items that are not yet True."
            )

        sprint["taskIds"].append(task_id)
        task["sprintId"] = sprint_id

    def complete_sprint(self, sprint_id):
        """Mark a sprint "Completed"; unfinished tasks return to the backlog.

        Only "Done" tasks stay assigned to the sprint. Any "To Do" or
        "In Progress" task is unassigned (sprintId=None) so it can be
        re-evaluated in the next Sprint Planning, rather than being left
        stranded on a closed sprint.

        Returns:
            List of task ids that were moved back to the backlog.
        """
        sprint = self.get_sprint(sprint_id)
        if sprint is None:
            raise ValueError(f"Sprint '{sprint_id}' not found.")
        validate_sprint_transition(sprint["status"], "Completed")

        returned_to_backlog = []
        # Iterate over a copy of taskIds since we mutate the list while looping.
        for task_id in list(sprint["taskIds"]):
            task = self.get_task(task_id)

            # Defensive check: if a task id was assigned but was never
            # registered (or was deleted elsewhere), treat it the same as
            # an unfinished task rather than silently keeping a dangling
            # reference to a sprint that's about to close.
            is_done = task is not None and task["status"] == "Done"

            if not is_done:
                sprint["taskIds"].remove(task_id)
                if task is not None:
                    task["sprintId"] = None
                returned_to_backlog.append(task_id)

        sprint["status"] = "Completed"
        return returned_to_backlog

    def add_retrospective_card(self, id, sprint_id, category, content):
        """Add a retrospective card, only for sprints that have finished."""
        sprint = self.get_sprint(sprint_id)
        if sprint is None:
            raise ValueError(f"Sprint '{sprint_id}' not found.")
        if sprint["status"] != "Completed":
            raise ValueError(
                f"Cannot add a retrospective card to sprint '{sprint_id}': "
                f"sprint is still '{sprint['status']}'. Retrospectives only "
                "happen after a sprint is Completed."
            )
        validate_retro_category(category)

        card = {
            "id": id,
            "sprintId": sprint_id,
            "category": category,
            "content": content,
        }
        self.retrospective_cards.append(card)
        return card

    def to_dict(self):
        return {
            "sprints": self.sprints,
            "retrospectiveCards": self.retrospective_cards,
            "tasks": self.tasks,
        }

    @classmethod
    def from_dict(cls, data):
        planner = cls()
        planner.sprints = data.get("sprints", [])
        planner.retrospective_cards = data.get("retrospectiveCards", [])
        planner.tasks = data.get("tasks", {})
        return planner


def load_state(path=STATE_FILE):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return Planner()
    return Planner.from_dict(data)


def save_state(planner, path=STATE_FILE):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(planner.to_dict(), f, indent=2, sort_keys=True)


if __name__ == "__main__":
    planner = load_state()
    save_state(planner)
