import { pool } from "../config/pool.js";

export const getOrCreateTerm = async (academicYear, semester) => {
  const query = `
    INSERT INTO terms (academic_year, semester)
    VALUES ($1, $2)
    ON CONFLICT (academic_year, semester)
    DO UPDATE SET academic_year = EXCLUDED.academic_year
    RETURNING term_id
  `;

  const { rows } = await pool.query(query, [academicYear, semester]);
  return rows[0].term_id;
};

export const createMark = async (
  studentId,
  subjectId,
  markObtained,
  semester,
  academicYear,
) => {
  const termId = await getOrCreateTerm(academicYear, semester);

  const query = `
    INSERT INTO marks (student_id, subject_id, term_id, mark_obtained)
    VALUES ($1, $2, $3, $4)
    RETURNING mark_id, student_id, subject_id, term_id, mark_obtained
  `;

  const { rows } = await pool.query(query, [
    studentId,
    subjectId,
    termId,
    markObtained,
  ]);

  return {
    ...rows[0],
    semester,
    academic_year: academicYear,
  };
};

export const getAllMarks = async (filters = {}) => {
  let query = `
    SELECT 
      m.mark_id,
      m.student_id,
      m.subject_id,
      m.term_id,
      m.mark_obtained,
      t.academic_year,
      t.semester,
      m.created_at,
      m.updated_at,
      s.name AS student_name,
      sub.name AS subject_name,
      sub.code AS subject_code
    FROM marks m
    LEFT JOIN terms t ON m.term_id = t.term_id
    LEFT JOIN students s ON m.student_id = s.student_id
    LEFT JOIN subjects sub ON m.subject_id = sub.subject_id
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (filters.student_id) {
    query += ` AND m.student_id = $${paramIndex}`;
    params.push(filters.student_id);
    paramIndex++;
  }

  if (filters.subject_id) {
    query += ` AND m.subject_id = $${paramIndex}`;
    params.push(filters.subject_id);
    paramIndex++;
  }

  if (filters.semester) {
    query += ` AND t.semester = $${paramIndex}`;
    params.push(filters.semester);
    paramIndex++;
  }

  if (filters.academic_year) {
    query += ` AND t.academic_year = $${paramIndex}`;
    params.push(filters.academic_year);
    paramIndex++;
  }

  query += " ORDER BY m.created_at DESC";

  const { rows } = await pool.query(query, params);
  return rows;
};

export const getMarkById = async (id) => {
  const query = `
    SELECT 
      m.mark_id,
      m.student_id,
      m.subject_id,
      m.term_id,
      m.mark_obtained,
      t.academic_year,
      t.semester,
      m.created_at,
      m.updated_at,
      s.name AS student_name,
      sub.name AS subject_name
    FROM marks m
    LEFT JOIN terms t ON m.term_id = t.term_id
    LEFT JOIN students s ON m.student_id = s.student_id
    LEFT JOIN subjects sub ON m.subject_id = sub.subject_id
    WHERE m.mark_id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    const error = new Error("Mark not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateMark = async (id, markObtained) => {
  await getMarkById(id);

  const query = `
    UPDATE marks
    SET mark_obtained = $1
    WHERE mark_id = $2
    RETURNING mark_id, mark_obtained
  `;

  const { rows } = await pool.query(query, [markObtained, id]);

  return rows[0];
};

export const deleteMark = async (id) => {
  await getMarkById(id);

  await pool.query("DELETE FROM marks WHERE mark_id = $1", [id]);

  return { message: "Mark deleted successfully" };
};
