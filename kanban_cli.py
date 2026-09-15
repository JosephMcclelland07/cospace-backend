"""A simple command-line Kanban task manager."""

COLUMNS = ["To Do", "In Progress", "Done"]
WIP_LIMITS = {"In Progress": 2}


class Task:
    def __init__(self, title, description, status="To Do"):
        self.title = title
        self.description = description
        self.status = status

    def move_to_next_column(self):
        current_index = COLUMNS.index(self.status)
        if current_index < len(COLUMNS) - 1:
            self.status = COLUMNS[current_index + 1]
            return True
        return False

    def __str__(self):
        return f"- {self.title}: {self.description}"


class Board:
    def __init__(self):
        self.tasks = []

    def add_task(self, title, description):
        task = Task(title, description)
        self.tasks.append(task)
        return task

    def move_task(self, title):
        for task in self.tasks:
            if task.title == title:
                current_index = COLUMNS.index(task.status)
                if current_index >= len(COLUMNS) - 1:
                    return False
                next_column = COLUMNS[current_index + 1]
                limit = WIP_LIMITS.get(next_column)
                if limit is not None:
                    count_in_next = sum(1 for t in self.tasks if t.status == next_column)
                    if count_in_next >= limit:
                        return "wip_limit_reached"
                task.move_to_next_column()
                return True
        return None

    def display(self):
        for column in COLUMNS:
            print(f"\n=== {column} ===")
            column_tasks = [task for task in self.tasks if task.status == column]
            if not column_tasks:
                print("(no tasks)")
            for task in column_tasks:
                print(task)


def print_help():
    print(
        "\nCommands:\n"
        "  add <title> [| <description>]   - add a new task (description is optional)\n"
        "  move <title>                     - move a task to the next column (In Progress limit: 2)\n"
        "  show                             - display the board\n"
        "  help                             - show this help message\n"
        "  quit                             - exit the program"
    )


def main():
    board = Board()
    print_help()
    board.display()

    while True:
        raw_command = input("\n> ").strip()
        command = raw_command.lower()

        if command == "quit":
            break
        elif command == "help":
            print_help()
        elif command == "show":
            board.display()
        elif command.startswith("add"):
            payload = raw_command[len("add"):].strip()
            if not payload:
                print("Usage: add <title> [| <description>]")
                continue
            if "|" in payload:
                title, description = payload.split("|", 1)
                title, description = title.strip(), description.strip()
            else:
                title, description = payload, ""
            if not title:
                print("Task title cannot be empty.")
                continue
            board.add_task(title, description)
            print(f"Added task '{title}' to To Do.")
            board.display()
        elif command.startswith("move"):
            title = raw_command[len("move"):].strip()
            if not title:
                print("Usage: move <title>")
                continue
            result = board.move_task(title)
            if result is True:
                print(f"Moved task '{title}' to the next column.")
            elif result is False:
                print(f"Task '{title}' is already in the last column.")
            elif result == "wip_limit_reached":
                limit = WIP_LIMITS["In Progress"]
                print(
                    f"Cannot move '{title}' to 'In Progress': WIP limit of {limit} "
                    "reached. Move or finish an existing task there first."
                )
            else:
                print(f"Task '{title}' not found.")
        else:
            print("Unknown command. Type 'help' for a list of commands.")


if __name__ == "__main__":
    main()
