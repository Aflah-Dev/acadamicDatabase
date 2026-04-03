import { pool } from "../config/pool.js";

export const createSubject = async (
  name,
  code,
  departmentId,
  totalMark = 100
) => {
  const query = `
    INSERT INTO subjects (name, code, department_id, total_mark)
    VALUES ($1, $2, $3, $4)
    RETURNING subject_id, name, code, department_id, total_mark
  `;

  const { rows } = await pool.query(query, [
    name,
    code,
    departmentId,
    totalMark,
  ]);

  return rows[0];
};

export const getAllSubjects = async () => {
  const query = `
    SELECT 
      s.*,
      d.name AS department_name
    FROM subjects s
    LEFT JOIN departments d
      ON s.department_id = d.department_id
    ORDER BY s.name
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getSubjectById = async (id) => {
  const query = `
    SELECT 
      s.*,
      d.name AS department_name
    FROM subjects s
    LEFT JOIN departments d
      ON s.department_id = d.department_id
    WHERE s.subject_id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    const error = new Error("Subject not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateSubject = async (
  id,
  name,
  code,
  departmentId,
  totalMark
) => {
  await getSubjectById(id);

  const query = `
    UPDATE subjects
    SET name = $1,
        code = $2,
        department_id = $3,
        total_mark = $4
    WHERE subject_id = $5
    RETURNING subject_id, name, code, department_id, total_mark
  `;

  const { rows } = await pool.query(query, [
    name,
    code,
    departmentId,
    totalMark,
    id,
  ]);

  return rows[0];
};

export const deleteSubject = async (id) => {
  await getSubjectById(id);

  const markQuery =
    "SELECT COUNT(*) AS count FROM marks WHERE subject_id = $1";

  const { rows: markRows } = await pool.query(markQuery, [id]);

  const markCount = parseInt(markRows[0].count);

  if (markCount > 0) {
    const error = new Error("Cannot delete subject with existing marks");
    error.statusCode = 409;
    error.customMessage = "Cannot delete subject with existing marks";
    throw error;
  }

  await pool.query(
    "DELETE FROM subjects WHERE subject_id = $1",
    [id]
  );

  return { message: "Subject deleted successfully" };
};