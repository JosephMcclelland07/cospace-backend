--Teams
INSERT INTO teams (id, name) VALUES
(1, 'Engineering'),
(2, 'Support'),
(3, 'Operations');

-- Colleagues (8 total)
INSERT INTO users (id, username, team_id) VALUES
(1, 'alice', 1),
(2, 'bob', 1),
(3, 'charlie', 2),
(4, 'david', 2),
(5, 'emma', 3),
(6, 'frank', 3),
(7, 'grace', 1),
(8, 'harry', 2); -- no bookings

-- Meeting Rooms (3 total)
INSERT INTO meeting_rooms (id, name) VALUES
(1, 'Room A'),
(2, 'Room B'),
(3, 'Room C');

-- Desks (4 total)
INSERT INTO desks (id, name) VALUES
(1, 'Desk 1'),
(2, 'Desk 2'),
(3, 'Desk 3'),
(4, 'Desk 4');

-- Bookings (6 total)
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

