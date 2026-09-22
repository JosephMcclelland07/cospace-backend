SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name,
       t.name AS ncat team_name,
       COUNT(b.id) AS total_bookings
FROM users u
LEFT JOIN teams t
ON u.team_id = t.id
LEFT JOIN bookings b
ON u.id = b.user_id
GROUP BY u.id,
         u.first_name,
         u.last_name,
         t.name
ORDER BY full_name;

## CONCAT(u.first_name, ' ', u.last_name) combines the colleague's first and last name into a single full_name column.

## LEFT JOIN teams links each colleague to their team and displays the team name.

## LEFT JOIN bookings ensures that colleagues with NO BOOKING are still included in the results.

## COUNT(b.id) counts only actual booking records. If a colleague has no bookings, b.id is NULL, so the count correctly returns 0.

## GROUP BY groups all bookings belonging to the same colleague into a single row, allowing the total number of bookings to be calculated.

## Using LEFT JOIN instead of INNER JOIN ensures colleagues with NO BOOKINGS are not excluded from the results.

UPDATE users
SET team_id = 2
WHERE id = 1;

## Update users selects table to modify.  2 allows the change to happen. id =1 enusres it only takes the id of colleuge #1

DELETE FROM desks
WHERE id = 4;

The database returned Error 1451 because the desk is referenced by rows in the bookings table. This confirms that the foreign key is using RESTRICT behaviour rather than CASCADE. The database correctly prevents the deletion of a parent record when child records still exist, preserving referential integrity.

## ------------------ STEP 6 -------------------------

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS desks;
DROP TABLE IF EXISTS meeting_rooms;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;

-----THEN------ 

CREATE TABLE teams (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE meeting_rooms (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE desks (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE bookings (
    id INT PRIMARY KEY,
    user_id INT,
    desk_id INT,
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (desk_id) REFERENCES desks(id)
);

RERUN SEED SCRIPT

## Using this sequence I was able to redbuild the database with the down migration, up migration, and seed script in succession shpwing it can be restored from an empty state.