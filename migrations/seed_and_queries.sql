-- 3 xTeams
INSERT INTO teams (id, name) VALUES
(1, 'Engineering'),
(2, 'Support'),
(3, 'Operations');

--8 Users
INSERT INTO users (id, first_name, last_name, team_id) VALUES
(1, 'Alice', 'Smith', 1),
(2, 'Bob', 'Jones', 1),
(3, 'Charlie', 'Brown', 2),
(4, 'David', 'Wilson', 2),
(5, 'Emma', 'Taylor', 3),
(6, 'Frank', 'Moore', 3),
(7, 'Grace', 'Lee', 1),
(8, 'Harry', 'White', 2);

-- (3 total)
INSERT INTO meeting_rooms (id, name) VALUES
(1, 'Room A'),
(2, 'Room B'),
(3, 'Room C');

-- (4 total)
INSERT INTO desks (id, name) VALUES
(1, 'Desk 1'),
(2, 'Desk 2'),
(3, 'Desk 3'),
(4, 'Desk 4');

-- (6 total)
INSERT INTO bookings (
    id,
    user_id,
    desk_id,
    start_time,
    end_time
) VALUES
(1, 1, 1, '2026-09-16 09:00:00', '2026-09-16 17:00:00'),
(2, 2, 2, '2026-09-16 09:00:00', '2026-09-16 17:00:00'),
(3, 3, 3, '2026-09-16 09:00:00', '2026-09-16 17:00:00'),
(4, 4, 1, '2026-09-17 09:00:00', '2026-09-17 17:00:00'),
(5, 5, 4, '2026-09-17 09:00:00', '2026-09-17 17:00:00'),
(6, 6, 2, '2026-09-18 09:00:00', '2026-09-18 17:00:00');

