-- ==========================================
-- INNER JOIN
-- Show users and their teams
-- ==========================================

SELECT u.username,
       t.name AS team_name
FROM users u
INNER JOIN teams t
ON u.team_id = t.id;


-- ==========================================
-- LEFT JOIN
-- Show all users, even if they have no team
-- ==========================================

SELECT u.username,
       t.name AS team_name
FROM users u
LEFT JOIN teams t
ON u.team_id = t.id;


-- ==========================================
-- FIND TEAMS WITH NO USERS
-- ==========================================

SELECT t.name
FROM teams t
LEFT JOIN users u
ON t.id = u.team_id
WHERE u.id IS NULL;


-- ==========================================
-- COUNT USERS PER TEAM
-- ==========================================

SELECT t.name,
       COUNT(u.id) AS user_count
FROM teams t
LEFT JOIN users u
ON t.id = u.team_id
GROUP BY t.id, t.name;


-- ==========================================
-- SHOW BOOKINGS WITH USER AND DESK DETAILS
-- ==========================================

SELECT u.username,
       d.name AS desk_name,
       b.start_time,
       b.end_time
FROM bookings b
INNER JOIN users u
ON b.user_id = u.id
INNER JOIN desks d
ON b.desk_id = d.id;


-- ==========================================
-- FIND DESKS WITH NO BOOKINGS
-- ==========================================

SELECT d.name
FROM desks d
LEFT JOIN bookings b
ON d.id = b.desk_id
WHERE b.id IS NULL;


-- ==========================================
-- COUNT BOOKINGS PER DESK
-- ==========================================

SELECT d.name,
       COUNT(b.id) AS booking_count
FROM desks d
LEFT JOIN bookings b
ON d.id = b.desk_id
GROUP BY d.id, d.name;


-- ==========================================
-- UPDATE
-- Move a user to another team
-- ==========================================

UPDATE users
SET team_id = 2
WHERE id = 1;


-- CHECK UPDATE

SELECT *
FROM users
WHERE id = 1;


-- ==========================================
-- DELETE
-- Remove one user
-- ==========================================

DELETE FROM users
WHERE id = 5;


-- CHECK DELETE

SELECT *
FROM users;


-- ==========================================
-- VIEW ALL USERS
-- ==========================================

SELECT *
FROM users;


-- ==========================================
-- VIEW ALL TEAMS
-- ==========================================

SELECT *
FROM teams;


-- ==========================================
-- VIEW ALL BOOKINGS
-- ==========================================

SELECT *
FROM bookings;


-- ==========================================
-- VIEW ALL DESKS
-- ==========================================

SELECT *
FROM desks;


-- ==========================================
-- DESCRIBE TABLES
-- ==========================================

DESCRIBE users;

DESCRIBE teams;

DESCRIBE desks;

DESCRIBE bookings;


-- ==========================================
-- FIND USERS WITHOUT A TEAM
-- ==========================================

SELECT u.username
FROM users u
LEFT JOIN teams t
ON u.team_id = t.id
WHERE t.id IS NULL;


-- ==========================================
-- FIND BOOKINGS WITHOUT A USER
-- ==========================================

SELECT b.id
FROM bookings b
LEFT JOIN users u
ON b.user_id = u.id
WHERE u.id IS NULL;


-- =======================





# SQL Joins, Indexes & Booking Constraint Notes

## Inner Join

Returns only records that exist in both tables.

```sql
SELECT u.username,
       t.name AS team_name
FROM users u
INNER JOIN teams t
ON u.team_id = t.id;
```

---

## Left Join

Returns all records from the left table and matching records from the right table.

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

### Important

Correct:

```sql
COUNT(u.id)
```

Incorrect:

```sql
COUNT(*)
```

*COUNT(u.id)` ignores NULL values*and correctly shows 0 for teams wi*hout users.

---

*# Show*Which User Booked Which Desk*
```sql
SELECT u.username,
       *.name*AS desk_name,
*      b.start_time,
       b.end_t*me
FROM bookings b
INNER JOIN user* u
ON b.user_id = u.id
INNER JOIN *esks d
ON b.desk_id = d.id;
*``

*--

## Find Desks With No*Bookings

```sql
SELECT d.name
*ROM desks d
LEFT JOIN bookings b
O* d.id = b.desk_id
WHERE b*id IS*NULL;
```

---

## Count Bookings *er Desk

```sql*SELECT d.name,
       COUNT*b.id) AS booking_count
*ROM desks d
LEFT JOIN bookings b
O* d.id*= b.desk_id
GROUP BY*d.id, d.name*
```

---

## Update a User

```sq*
UPDATE users
*ET team_id = 2
WHERE id = 1;
```

*heck*

```sql
SELECT *
FROM users
WHERE*id =*1;
```

---

## Delete a User

```*ql
*ELETE FROM users
WHERE id = 5;
```*
Check:

```sql*SELECT *
FROM users;
```

---

## *how All Data

### Users

```sql*SELECT** FROM users;
```

### Teams

```s*l
*ELECT * FROM teams;
```

### Desks*
```sql
*ELECT * FROM desks;
```

### Booki*gs

```sql
SELECT** FROM bookings;
```

---

## Desc*ibe Table Structure

```sql
*ESCRIBE users;
```

*``sql
DESCRIBE teams;
*``

*``sql
DESCRIBE desks*
```

```sql
DESCRIBE bookings;
``*

---

# Unique Index Exercise

##*Create the Unique Index (002 Up Mi*ration)

```sql
CREATE UNIQUE INDE* idx_bookings_desk_date
ON booking* (desk_id, start_time);
```

*urpose:

* Prevent duplicate bookings
- One*desk*can only be booked once for*a particular time slot

---

##*Check the*Index Exists

```sql*SHOW*INDEX FROM bookings;
```

Expected*

```text**dx_bookings_desk_date
Non_unique =*0
```

*--

## Insert a Booking

*``sql
INSERT INTO bookings (
    i*,
    user_id,
    desk_id,
    st*rt_time,
    end_time
*
VALUES (
    1,
    1*
    1,
    '*026*09-16 09:00:*0',
    '2026-09-16 17:00:00'
*;
```

*xpected:

*``text
1*row affected
```

*--

## Attempt*to Double Book the Desk

```sql
IN*ERT INTO bookings (
    id,
    us*r_id*
    desk_id,
    start_time,
*   end_time
)
VALUES (
    2*
*   2,
    1,
    '*026-09-16 09:00:00',
*   '*026-09*16 17:00:00'
);
```

Expected:

``*text*ERROR 1062
```

Because*the same desk is*already booked at the same time.

*--

## Book the Same Desk on a Dif*erent Day

```sql*INSERT INTO bookings (
    id,
   *user_id,
    desk_id,
    start_ti*e,
    end_time
)
VALUES (
    3*
    2,
    *,
*   '2026-09-17 09*00:00',
    '*026-09-*7 17:00:00'
*;
```

Expected:

```text*1 row affected
*``

---

## Remove the Unique Inde* (002 Down Migration*

```sql*DROP INDEX idx_bookings_desk_date*ON bookings;
```

*--

## Verify*Index Removal

```sql
SHOW*INDEX FROM bookings;
```

Should*no longer show:

```text*idx_bookings*desk_date
```

---

## Insert a Du*licate Booking After*Removing the Index

*``sql
INSERT INTO bookings (
    i*,
    user_id,
    desk_id,
    st*rt_time,
    end_time
)
VALUES *
    999*
    2,
    1,
*   '2026-09-16 *9:00:00',
    '*026*09-16 17:00:00'
*;
```

Expected:

```text*1 row affected
*``

This proves the index was*enforcing the rule.

---

##*Find Duplicate Bookings

```sql**ELECT desk_id,
       start_time,
       COUNT(*) AS total
FROM bookings
GROUP BY desk_id, start_time
HAVING COUNT(*) > 1;
```

---

## View Duplicate*Rows

```sql
SELECT *
FROM booking*
WHERE desk_id = 1
  AND start_tim* = '2026-09-16 09:00:00';
```

---*
## Delete a Duplicate Row

```sql*DELETE FROM bookings
WHERE id = 99*;
```

Replace `999` with the dupl*cate booking ID.

---

## Recreate*the Index

```sql
CREATE UNIQUE IN*EX idx_bookings_desk_date
ON*bookings*(desk_id, start_time);
```

Note:
*This will*fail*with:

*``text
ERROR 1062
*``

if duplicate bookings still ex*st.

You must remove*all duplicates first.

---

##*Find*All Remaining Duplicates

```sql
S*LECT desk_id,
       start_time,
*      COUNT(*) AS total
FROM bookings
GROUP BY desk_id, start_time
HAVING COUNT(*) > 1;
```

*eep deleting duplicates*until this query returns:

```text*Empty*set
```

Then recreate the index s*ccessfully.

*--

# Key Concepts

*# INNER JOIN

Only matching record*.

```sql
INNER JOIN
```

---

*# LEFT JOIN

All records*from the left table plus matches.
*```sql
LEFT JOIN
``*

*--

## Find*Missing*Records

```sql
WHERE other_table.*d IS NULL
```

---

## Correct Cou*ting

```sql
COUNT(column_name)
``*

not

```sql
COUNT(*)
```

when u*ing LEFT JOINs.

---

## Unique In*ex

```sql
CREATE UNIQUE INDEX**``

Prevents duplicate values*for the indexed*columns.

---

## Error 1062

```t*xt
Duplicate entry
```

*eans a PRIMARY KEY or UNIQUE INDEX*is blocking duplicate data.

---

*# Error 1452

```text*Cannot add or update a child row
*``

*eans a FOREIGN KEY references*a record that does not exist.

Exa*ple:

*``sql
user*id = 99
```

when there*is no user with ID 99.
````*