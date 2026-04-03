import { pool } from "../config/pool.js";

// Create new department
export const createDepartment = async (name, code) => {
  const query = `
    INSERT INTO departments (name, code)
    VALUES ($1, $2)
    RETURNING department_id, name, code
  `;

  const { rows } = await pool.query(query, [name, code]);

  return rows[0];
};

// Get all departments
export const getAllDepartments = async () => {
  const query = `
    SELECT *
    FROM departments
    ORDER BY name
  `;

  const { rows } = await pool.query(query);
  return rows;
};

// Get department by ID
export const getDepartmentById = async (id) => {
  const query = `
    SELECT *
    FROM departments
    WHERE department_id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    const error = new Error("Department not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

// Update department
export const updateDepartment = async (id, name, code) => {
  await getDepartmentById(id);

  const query = `
    UPDATE departments
    SET name = $1,
        code = $2
    WHERE department_id = $3
    RETURNING department_id, name, code
  `;

  const { rows } = await pool.query(query, [name, code, id]);

  return rows[0];
};

// Delete department
export const deleteDepartment = async (id) => {
  await getDepartmentById(id);

  const teacherQuery =
    "SELECT COUNT(*) AS count FROM teachers WHERE department_id = $1";

  const { rows: teacherRows } = await pool.query(teacherQuery, [id]);

  const subjectQuery =
    "SELECT COUNT(*) AS count FROM subjects WHERE department_id = $1";

  const { rows: subjectRows } = await pool.query(subjectQuery, [id]);

  const teacherCount = parseInt(teacherRows[0].count);
  const subjectCount = parseInt(subjectRows[0].count);

  if (teacherCount > 0 || subjectCount > 0) {
    const error = new Error(
      "Cannot delete department with existing teachers or subjects",
    );
    error.statusCode = 409;
    error.customMessage =
      "Cannot delete department with existing teachers or subjects";
    throw error;
  }

  await pool.query("DELETE FROM departments WHERE department_id = $1", [id]);

  return { message: "Department deleted successfully" };
};
