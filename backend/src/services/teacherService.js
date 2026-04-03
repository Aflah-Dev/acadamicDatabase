import { pool } from "../config/pool.js";

export const createTeacher = async (name, email, departmentId) => {
  const query = `
    INSERT INTO teachers (name, email, department_id)
    VALUES ($1, $2, $3)
    RETURNING teacher_id, name, email, department_id
  `;

  const { rows } = await pool.query(query, [name, email, departmentId]);

  return rows[0];
};

export const getAllTeachers = async () => {
  const query = `
    SELECT 
      t.*,
      d.name AS department_name
    FROM teachers t
    LEFT JOIN departments d
      ON t.department_id = d.department_id
    ORDER BY t.name
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getTeacherById = async (id) => {
  const query = `
    SELECT 
      t.*,
      d.name AS department_name
    FROM teachers t
    LEFT JOIN departments d
      ON t.department_id = d.department_id
    WHERE t.teacher_id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    const error = new Error("Teacher not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateTeacher = async (id, name, email, departmentId) => {
  await getTeacherById(id);

  const query = `
    UPDATE teachers
    SET name = $1,
        email = $2,
        department_id = $3
    WHERE teacher_id = $4
    RETURNING teacher_id, name, email, department_id
  `;

  const { rows } = await pool.query(query, [
    name,
    email,
    departmentId,
    id,
  ]);

  return rows[0];
};

export const deleteTeacher = async (id) => {
  await getTeacherById(id);

  await pool.query(
    "DELETE FROM teachers WHERE teacher_id = $1",
    [id]
  );

  return { message: "Teacher deleted successfully" };
};