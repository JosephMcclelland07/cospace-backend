CREATE TABLE teams (
    id INT PRIMARY KEY, 
    name VARCHAR(25) NOT NULL,
    department_name VARCHAR(25) NOT NULL
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL,
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE rooms (
    id INT PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE desks(
    id INT PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    floor INT NOT NULL
);

CREATE TABLE bookings (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    desk_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (desk_id) REFERENCES desks(id)
);