// Validation middleware functions

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim();
};

// Validate required fields
const validateRequired = (fields) => {
  return (req, res, next) => {
    const errors = [];

    for (const field of fields) {
      if (
        !req.body[field] ||
        (typeof req.body[field] === "string" && req.body[field].trim() === "")
      ) {
        errors.push(`${field} is required`);
      }
    }

    if (errors.length > 0) {
      const error = new Error(errors.join(", "));
      error.name = "ValidationError";
      return next(error);
    }

    // Sanitize string fields
    for (const field in req.body) {
      if (typeof req.body[field] === "string") {
        req.body[field] = sanitizeString(req.body[field]);
      }
    }

    next();
  };
};

// Validate mark range (0-100)
const validateMark = (req, res, next) => {
  const mark = parseInt(req.body.mark_obtained);

  if (isNaN(mark) || mark < 0 || mark > 100) {
    const error = new Error("Mark must be between 0 and 100");
    error.name = "ValidationError";
    return next(error);
  }

  req.body.mark_obtained = mark;
  next();
};

// Validate grade enum
const validateGrade = (req, res, next) => {
  const validGrades = ["9", "10", "11", "12"];

  if (req.body.grade && !validGrades.includes(req.body.grade)) {
    const error = new Error("Grade must be one of: 9, 10, 11, 12");
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

// Validate gender enum
const validateGender = (req, res, next) => {
  const validGenders = ["M", "F"];

  if (req.body.gender && !validGenders.includes(req.body.gender)) {
    const error = new Error("Gender must be either M or F");
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

// Validate student school ID format
const validateStudentSchoolId = (req, res, next) => {
  if (req.body.student_school_id) {
    const schoolIdRegex = /^[A-Za-z0-9-]{3,20}$/;
    if (!schoolIdRegex.test(req.body.student_school_id)) {
      const error = new Error(
        "student_school_id must be 3-20 chars using letters, numbers, or hyphen",
      );
      error.name = "ValidationError";
      return next(error);
    }
  }

  next();
};

// Validate semester enum
const validateSemester = (req, res, next) => {
  const validSemesters = ["I", "II"];

  if (req.body.semester && !validSemesters.includes(req.body.semester)) {
    const error = new Error("Semester must be either I or II");
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

// Validate email format
const validateEmail = (req, res, next) => {
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      const error = new Error("Invalid email format");
      error.name = "ValidationError";
      return next(error);
    }
  }

  next();
};

// Validate positive integer
const validatePositiveInt = (field) => {
  return (req, res, next) => {
    if (req.body[field] !== undefined) {
      const value = parseInt(req.body[field]);
      if (isNaN(value) || value <= 0) {
        const error = new Error(`${field} must be a positive integer`);
        error.name = "ValidationError";
        return next(error);
      }
      req.body[field] = value;
    }
    next();
  };
};

export{
  validateRequired,
  validateMark,
  validateGrade,
  validateGender,
  validateStudentSchoolId,
  validateSemester,
  validateEmail,
  validatePositiveInt,
  sanitizeString,
};
