import { pool } from "../config/pool.js";

export const getAcademicReports = async (filters = {}) => {
  let query = `
    SELECT *
    FROM student_academic_report
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (filters.grade) {
    query += ` AND grade = $${paramIndex}`;
    params.push(filters.grade);
    paramIndex++;
  }

  if (filters.academic_year) {
    query += ` AND academic_year = $${paramIndex}`;
    params.push(filters.academic_year);
    paramIndex++;
  }

  if (filters.semester) {
    query += ` AND semester = $${paramIndex}`;
    params.push(filters.semester);
    paramIndex++;
  }

  if (filters.student_id) {
    query += ` AND student_id = $${paramIndex}`;
    params.push(filters.student_id);
    paramIndex++;
  }

  if (filters.student_school_id) {
    query += ` AND student_school_id = $${paramIndex}`;
    params.push(filters.student_school_id);
    paramIndex++;
  }

  query += `
    ORDER BY
      academic_year DESC,
      CASE semester WHEN 'II' THEN 2 WHEN 'I' THEN 1 ELSE 0 END DESC,
      grade ASC,
      rank ASC,
      student_name ASC
  `;

  const { rows } = await pool.query(query, params);
  return rows;
};

export const getStudentReport = async (studentId) => {
  const query = `
    SELECT *
    FROM student_academic_report
    WHERE student_id = $1
  `;

  const { rows } = await pool.query(query, [studentId]);

  if (rows.length === 0) {
    const error = new Error("Student report not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};
