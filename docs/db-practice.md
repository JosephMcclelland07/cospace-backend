CREATE TABLE departments (
    id INT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);

CREATE TABLE employees (
    id INT PRIMARY KEY,
    employee_name VARCHAR(50) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO departments VALUES
(1, 'IT'),
(2, 'HR'),
(3, 'Finance'),
(4, 'Marketing');

INSERT INTO employees VALUES
(1, 'Alice', 1),
(2, 'Bob', 1),
(3, 'Charlie', 2),
(4, 'David', 3),
(5, 'Emma', 3),
(6, 'Frank', NULL);

SELECT e.name AS employee,
       d.name AS department
FROM employees e
INNER JOIN departments d
ON e.department_id = d.id;


SELECT e.name AS employee,
       d.name AS department
FROM employees e
LEFT JOIN departments d
ON e.department_id = d.id;

SELECT d.name AS department
FROM departments d
LEFT JOIN employees e
ON d.id = e.department_id
WHERE e.id IS NULL;

SELECT d.name AS department
FROM departments d
LEFT JOIN employees e
ON d.id = e.department_id
WHERE e.id IS NULL;

SELECT d.name AS department,
       COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e
ON d.id = e.department_id
GROUP BY d.id, d.name;

UPDATE employees
SET department_id = 3
WHERE id = 3;

SELECT * FROM employees
WHERE id = 3;

DELETE FROM employees
WHERE id = 6;

SELECT * FROM employees;

## ALL EXPECTED OUTPUTS