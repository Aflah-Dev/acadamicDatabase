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

export const createClass = async (
  className,
  grade,
  academicYear,
  semester,
  homeroomTeacherId,
) => {
  const termId = await getOrCreateTerm(academicYear, semester);

  const query = `
    INSERT INTO classes (class_name, grade, term_id, homeroom_teacher_id)
    VALUES ($1, $2, $3, $4)
    RETURNING class_id, class_name, grade, term_id, homeroom_teacher_id
  `;

  const { rows } = await pool.query(query, [
    className,
    grade,
    termId,
    homeroomTeacherId,
  ]);

  return {
    ...rows[0],
    academic_year: academicYear,
    semester: semester,
  };
};

export const getAllClasses = async () => {
  const query = `
    SELECT 
      c.class_id,
      c.class_name,
      c.grade,
      c.term_id,
      trm.academic_year,
      trm.semester,
      c.homeroom_teacher_id,
      c.created_at,
      c.updated_at,
      t.name AS homeroom_teacher_name
    FROM classes c
    LEFT JOIN terms trm ON c.term_id = trm.term_id
    LEFT JOIN teachers t ON c.homeroom_teacher_id = t.teacher_id
    ORDER BY c.grade, trm.academic_year, trm.semester, c.class_name
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getClassById = async (id) => {
  const query = `
    SELECT 
      c.class_id,
      c.class_name,
      c.grade,
      c.term_id,
      trm.academic_year,
      trm.semester,
      c.homeroom_teacher_id,
      c.created_at,
      c.updated_at,
      t.name AS homeroom_teacher_name
    FROM classes c
    LEFT JOIN terms trm ON c.term_id = trm.term_id
    LEFT JOIN teachers t ON c.homeroom_teacher_id = t.teacher_id
    WHERE c.class_id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateClass = async (
  id,
  className,
  grade,
  academicYear,
  semester,
  homeroomTeacherId,
) => {
  await getClassById(id);

  const termId = await getOrCreateTerm(academicYear, semester);

  const query = `
    UPDATE classes
    SET class_name = $1,
        grade = $2,
        term_id = $3,
        homeroom_teacher_id = $4
    WHERE class_id = $5
    RETURNING class_id, class_name, grade, term_id, homeroom_teacher_id
  `;

  const { rows } = await pool.query(query, [
    className,
    grade,
    termId,
    homeroomTeacherId,
    id,
  ]);

  return {
    ...rows[0],
    academic_year: academicYear,
    semester: semester,
  };
};

export const deleteClass = async (id) => {
  await getClassById(id);

  const studentCountQuery =
    "SELECT COUNT(*) AS count FROM students WHERE class_id = $1";

  const { rows } = await pool.query(studentCountQuery, [id]);

  if (parseInt(rows[0].count) > 0) {
    const error = new Error("Cannot delete class with existing students");
    error.statusCode = 409;
    error.customMessage = "Cannot delete class with existing students";
    throw error;
  }

  await pool.query("DELETE FROM classes WHERE class_id = $1", [id]);

  return { message: "Class deleted successfully" };
};
