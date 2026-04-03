import { pool } from "../config/pool.js";

export const getClassContext = async (classId) => {
  const query = `
    SELECT c.class_id, c.class_name, c.grade, t.academic_year, t.semester
    FROM classes c
    INNER JOIN terms t ON c.term_id = t.term_id
    WHERE c.class_id = $1
  `;

  const { rows } = await pool.query(query, [classId]);

  if (rows.length === 0) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const createStudent = async (
  studentSchoolId,
  name,
  gender,
  classId,
  grade,
  academicYear,
  semester
) => {
  const classContext = await getClassContext(classId);

  if (
    (grade && classContext.grade !== grade) ||
    (academicYear && classContext.academic_year !== academicYear) ||
    (semester && classContext.semester !== semester)
  ) {
    const error = new Error(
      "Student grade/term must match selected class grade/term"
    );
    error.statusCode = 400;
    throw error;
  }

  const query = `
    INSERT INTO students (student_school_id, name, gender, class_id)
    VALUES ($1, $2, $3, $4)
    RETURNING student_id, student_school_id, name, gender, class_id
  `;

  const { rows } = await pool.query(query, [
    studentSchoolId,
    name,
    gender,
    classId,
  ]);

  return {
    ...rows[0],
    class_name: classContext.class_name,
    grade: classContext.grade,
    academic_year: classContext.academic_year,
    semester: classContext.semester,
  };
};

export const getAllStudents = async () => {
  const query = `
    SELECT 
      s.student_id,
      s.student_school_id,
      s.name,
      s.gender,
      s.class_id,
      s.created_at,
      s.updated_at,
      c.class_name,
      c.grade,
      t.academic_year,
      t.semester
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN terms t ON c.term_id = t.term_id
    ORDER BY c.grade, s.name
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getStudentById = async (id) => {
  const query = `
    SELECT 
      s.student_id,
      s.student_school_id,
      s.name,
      s.gender,
      s.class_id,
      s.created_at,
      s.updated_at,
      c.class_name,
      c.grade,
      t.academic_year,
      t.semester
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN terms t ON c.term_id = t.term_id
    WHERE s.student_id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

export const updateStudent = async (
  id,
  studentSchoolId,
  name,
  gender,
  classId,
  grade,
  academicYear,
  semester
) => {
  await getStudentById(id);

  const classContext = await getClassContext(classId);

  if (
    (grade && classContext.grade !== grade) ||
    (academicYear && classContext.academic_year !== academicYear) ||
    (semester && classContext.semester !== semester)
  ) {
    const error = new Error(
      "Student grade/term must match selected class grade/term"
    );
    error.statusCode = 400;
    throw error;
  }

  const query = `
    UPDATE students
    SET student_school_id = $1,
        name = $2,
        gender = $3,
        class_id = $4
    WHERE student_id = $5
    RETURNING student_id, student_school_id, name, gender, class_id
  `;

  const { rows } = await pool.query(query, [
    studentSchoolId,
    name,
    gender,
    classId,
    id,
  ]);

  return {
    ...rows[0],
    class_name: classContext.class_name,
    grade: classContext.grade,
    academic_year: classContext.academic_year,
    semester: classContext.semester,
  };
};

export const deleteStudent = async (id) => {
  await getStudentById(id);

  const markQuery =
    "SELECT COUNT(*) AS count FROM marks WHERE student_id = $1";

  const { rows: markRows } = await pool.query(markQuery, [id]);

  const markCount = parseInt(markRows[0].count);

  if (markCount > 0) {
    const error = new Error("Cannot delete student with existing marks");
    error.statusCode = 409;
    error.customMessage = "Cannot delete student with existing marks";
    throw error;
  }

  await pool.query(
    "DELETE FROM students WHERE student_id = $1",
    [id]
  );

  return { message: "Student deleted successfully" };
};