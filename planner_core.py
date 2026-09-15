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

    def create_sprint(self, id, name, task_ids=[]):
        sprint = {
            "id": id,
            "name": name,
            "status": "Planning",
            "taskIds": task_ids,
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
        active_sprint = next((s for s in self.sprints if s["status"] == "Active"), None)
        if active_sprint is not None and active_sprint["id"] != sprint_id:
            raise ValueError(
                f"Cannot start sprint '{sprint_id}': sprint '{active_sprint['id']}' "
                "is already Active. Complete it first."
            )
        sprint["status"] = "Active"

    def add_task(self, task_id, status="To Do"):
        """Register a task in the planner's task registry.

        This is the single source of truth for a task's current column
        (status). Tasks start out unassigned to any sprint (sprintId=None,
        i.e. sitting in the backlog) until add_task_to_sprint() is called.
        """
        if status not in TASK_STATUSES:
            raise ValueError(f"Invalid task status '{status}'. Must be one of {TASK_STATUSES}.")
        self.tasks[task_id] = {"id": task_id, "status": status, "sprintId": None}
        return self.tasks[task_id]

    def get_task(self, task_id):
        return self.tasks.get(task_id)

    def set_task_status(self, task_id, status):
        """Update a task's column (To Do / In Progress / Done)."""
        task = self.get_task(task_id)
        if task is None:
            raise ValueError(f"Task '{task_id}' not found.")
        if status not in TASK_STATUSES:
            raise ValueError(f"Invalid task status '{status}'. Must be one of {TASK_STATUSES}.")
        task["status"] = status

    def add_task_to_sprint(self, sprint_id, task_id):
        """Assign a task to a sprint.

        Auto-registers the task (as "To Do") in the task registry if it
        hasn't been seen before, so callers don't have to call add_task()
        separately first.
        """
        sprint = self.get_sprint(sprint_id)
        if sprint is None:
            raise ValueError(f"Sprint '{sprint_id}' not found.")
        if task_id not in self.tasks:
            self.add_task(task_id)
        sprint["taskIds"].append(task_id)
        self.tasks[task_id]["sprintId"] = sprint_id

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
        if category not in RETRO_CATEGORIES:
            raise ValueError(
                f"Invalid category '{category}'. Must be one of {RETRO_CATEGORIES}."
            )

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
        planner.sprints = data["sprints"]
        planner.retrospective_cards = data["retrospectiveCards"]
        planner.tasks = data.get("tasks", {})
        return planner



def load_state(path=STATE_FILE):
    try:
        with open(path, "r") as f:
            data = json.load(f)
        return Planner.from_dict(data)
    except:
        return Planner()


def save_state(planner, path=STATE_FILE):
    f = open(path, "w")
    json.dump(planner.to_dict(), f)
    f.close()


if __name__ == "__main__":
    planner = load_state()
    save_state(planner)
