# SQL Joins & Booking System Cheatsheet

## INNER JOIN
Returns only matching records.

```sql
SELECT u.username,
       t.name AS team_name
FROM users u
INNER JOIN teams t
ON u.team_id = t.id;
```

---

## LEFT JOIN
Returns all records from the left table.

```sql
SELECT u.username,
       t.name AS team_name
FROM users u
LEFT JOIN teams t
ON u.team_id = t.id;
```

---

## Find Teams With No Users

```sql
SELECT t.name
FROM teams t
LEFT JOIN users u
ON t.id = u.team_id
WHERE u.id IS NULL;
```

---

## Count Users Per Team

```sql
SELECT t.name,
       COUNT(u.id) AS user_count
FROM teams t
LEFT JOIN users u
ON t.id = u.team_id
GROUP BY t.id, t.name;
```

✅ Use `COUNT(u.id)` instead of `COUNT(*)` so teams with no users show `0`.

---

## Show Booking Details

```sql
SELECT u.username,
       d.name AS desk_name,
       b.start_time,
       b.end_time
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN desks d ON b.desk_id = d.id;
```

---

## Find Desks With No Bookings

```sql
SELECT d.name
FROM desks d
LEFT JOIN bookings b
ON d.id = b.desk_id
WHERE b.id IS NULL;
```

---

## Count Bookings Per Desk

```sql
SELECT d.name,
       COUNT(b.id) AS booking_count
FROM desks d
LEFT JOIN bookings b
ON d.id = b.desk_id
GROUP BY d.id, d.name;
```

---

## Update a User

```sql
UPDATE users
SET team_id = 2
WHERE id = 1;
```

Check:

```sql
SELECT *
FROM users
WHERE id = 1;
```

---

## Delete a User

```sql
DELETE FROM users
WHERE id = 5;
```

---

## View Data

```sql
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM desks;
SELECT * FROM bookings;
```

---

## Describe Tables

```sql
DESCRIBE users;
DESCRIBE teams;
DESCRIBE desks;
DESCRIBE bookings;
```

---

## Find Missing Records

### Users Without a Team

```sql
SELECT u.username
FROM users u
LEFT JOIN teams t
ON u.team_id = t.id
WHERE t.id IS NULL;
```

### Bookings Without a User

```sql
SELECT b.id
FROM bookings b
LEFT JOIN users u
ON b.user_id = u.id
WHERE u.id IS NULL;
```

---

# Unique Index (Prevent Double Booking)

## Create Index

```sql
CREATE UNIQUE INDEX idx_bookings_desk_date
ON bookings (desk_id, start_time);
```

Prevents the same desk being booked twice at the same time.

---

## Check Index

```sql
SHOW INDEX FROM bookings;
```

---

## Remove Index

```sql
DROP INDEX idx_bookings_desk_date
ON bookings;
```

---

## Find Duplicate Bookings

```sql
SELECT desk_id,
       start_time,
       COUNT(*) AS total
*ROM bookings
GROUP BY desk_id, sta*t_time
HAVING COUNT(*) > 1;
```

---

## Delete a Duplicate

```sql
DELETE FROM bookings
WHERE id = 999;
```

---

# Common Errors

### Error 1062

```text
Duplicate entry
```

A PRIMARY KEY or UNIQUE INDEX is preventing duplicate data.

### Error 1452

```text
Cannot add or update a child row
```

A FOREIGN KEY references a record that does not exist.

Example:

```sql
INSERT INTO bookings (user_id)
VALUES (99);
```

when no user with ID 99 exists.

---

# Key Things to Remember

```sql
INNER JOIN
```

Only matching records.

```sql
LEFT JOIN
```

All records from the left table plus matches.

```sql
WHERE other_table.id IS NULL
```

Find missing records.

```sql
COUNT(column_name)
```

Use with LEFT JOINs to get accurate counts.

```sql
CREATE UNIQUE INDEX
```

Prevents duplicate values.