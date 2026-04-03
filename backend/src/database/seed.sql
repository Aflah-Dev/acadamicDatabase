BEGIN;

-- Departments
INSERT INTO departments (name, code)
VALUES
  ('Mathematics Department', 'MATH'),
  ('Languages & Humanities', 'LANG'),
  ('Science Department', 'SCI')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = CURRENT_TIMESTAMP;

-- Terms
INSERT INTO terms (academic_year, semester)
VALUES
  ('2024-2025', 'I'),
  ('2024-2025', 'II')
ON CONFLICT (academic_year, semester) DO NOTHING;

-- Teachers
INSERT INTO teachers (name, email, department_id)
VALUES
  ('Ujulu Samuel', 'ujulu@school.com', (SELECT department_id FROM departments WHERE code = 'MATH')),
  ('Mercy Atieno', 'mercy@school.com', (SELECT department_id FROM departments WHERE code = 'SCI')),
  ('John Omondi', 'john@school.com', (SELECT department_id FROM departments WHERE code = 'LANG')),
  ('Amina Yusuf', 'amina@school.com', (SELECT department_id FROM departments WHERE code = 'SCI')),
  ('Daniel Bekele', 'daniel@school.com', (SELECT department_id FROM departments WHERE code = 'MATH'))
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  department_id = EXCLUDED.department_id,
  updated_at = CURRENT_TIMESTAMP;

-- Subjects
INSERT INTO subjects (name, code, department_id, total_mark)
VALUES
  ('Maths', 'MTH101', (SELECT department_id FROM departments WHERE code = 'MATH'), 100),
  ('English', 'ENG101', (SELECT department_id FROM departments WHERE code = 'LANG'), 100),
  ('Biology', 'BIO101', (SELECT department_id FROM departments WHERE code = 'SCI'), 100),
  ('Chemistry', 'CHE101', (SELECT department_id FROM departments WHERE code = 'SCI'), 100),
  ('Physics', 'PHY101', (SELECT department_id FROM departments WHERE code = 'SCI'), 100)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  department_id = EXCLUDED.department_id,
  total_mark = EXCLUDED.total_mark,
  updated_at = CURRENT_TIMESTAMP;

-- Classes
INSERT INTO classes (class_name, grade, term_id, homeroom_teacher_id)
VALUES
  (
    '9A',
    '9',
    (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'),
    (SELECT teacher_id FROM teachers WHERE email = 'ujulu@school.com')
  ),
  (
    '9B',
    '9',
    (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'),
    (SELECT teacher_id FROM teachers WHERE email = 'mercy@school.com')
  ),
  (
    '10A',
    '10',
    (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'),
    (SELECT teacher_id FROM teachers WHERE email = 'john@school.com')
  ),
  (
    '10A',
    '10',
    (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'II'),
    (SELECT teacher_id FROM teachers WHERE email = 'daniel@school.com')
  )
ON CONFLICT (class_name, term_id) DO UPDATE SET
  grade = EXCLUDED.grade,
  homeroom_teacher_id = EXCLUDED.homeroom_teacher_id,
  updated_at = CURRENT_TIMESTAMP;

-- Students (Term I classes)
INSERT INTO students (student_school_id, name, gender, class_id)
VALUES
  (
    'STD-001',
    'STUD 1',
    'M',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '9A' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-002',
    'STUD 2',
    'F',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '9A' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-003',
    'STUD 3',
    'M',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '9A' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-004',
    'STUD 4',
    'F',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '9A' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-005',
    'STUD 5',
    'M',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '9B' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-006',
    'STUD 6',
    'F',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '9B' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-007',
    'STUD 7',
    'M',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '10A' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  ),
  (
    'STD-008',
    'STUD 8',
    'F',
    (
      SELECT c.class_id
      FROM classes c
      JOIN terms t ON t.term_id = c.term_id
      WHERE c.class_name = '10A' AND t.academic_year = '2024-2025' AND t.semester = 'I'
    )
  )
ON CONFLICT (student_school_id) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  class_id = EXCLUDED.class_id,
  updated_at = CURRENT_TIMESTAMP;

-- Marks for 2024-2025 Semester I
INSERT INTO marks (student_id, subject_id, term_id, mark_obtained)
VALUES
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-001'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 88),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-001'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 74),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-001'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 79),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-001'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 81),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-001'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 84),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-002'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 69),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-002'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 72),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-002'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 65),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-002'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 67),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-002'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 70),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-003'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 91),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-003'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 87),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-003'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 90),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-003'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 86),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-003'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 89),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-004'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 52),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-004'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 57),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-004'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 54),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-004'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 50),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-004'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 58),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-005'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 41),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-005'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 46),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-005'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 44),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-005'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 42),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-005'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 45),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-006'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 62),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-006'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 60),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-006'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 64),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-006'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 59),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-006'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 63),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-007'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 78),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-007'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 73),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-007'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 80),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-007'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 76),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-007'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 82),

  ((SELECT student_id FROM students WHERE student_school_id = 'STD-008'), (SELECT subject_id FROM subjects WHERE code = 'MTH101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 55),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-008'), (SELECT subject_id FROM subjects WHERE code = 'ENG101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 58),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-008'), (SELECT subject_id FROM subjects WHERE code = 'BIO101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 53),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-008'), (SELECT subject_id FROM subjects WHERE code = 'CHE101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 57),
  ((SELECT student_id FROM students WHERE student_school_id = 'STD-008'), (SELECT subject_id FROM subjects WHERE code = 'PHY101'), (SELECT term_id FROM terms WHERE academic_year = '2024-2025' AND semester = 'I'), 56)
ON CONFLICT (student_id, subject_id, term_id) DO UPDATE SET
  mark_obtained = EXCLUDED.mark_obtained,
  updated_at = CURRENT_TIMESTAMP;

COMMIT;
