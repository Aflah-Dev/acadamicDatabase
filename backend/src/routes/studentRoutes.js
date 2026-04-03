import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import {
  validateRequired,
  validateStudentSchoolId,
  validateGender,
  validateGrade,
  validateSemester,
  validatePositiveInt,
} from '../middlewares/validator.js';

const router = Router();

router.post(
  "/",
  validateRequired([
    "student_school_id",
    "name",
    "gender",
    "class_id",
    "grade",
    "academic_year",
    "semester",
  ]),
  validateStudentSchoolId,
  validatePositiveInt("class_id"),
  validateGender,
  validateGrade,
  validateSemester,
  studentController.createStudent,
);

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);

router.put(
  "/:id",
  validateRequired([
    "student_school_id",
    "name",
    "gender",
    "class_id",
    "grade",
    "academic_year",
    "semester",
  ]),
  validateStudentSchoolId,
  validatePositiveInt("class_id"),
  validateGender,
  validateGrade,
  validateSemester,
  studentController.updateStudent,
);

router.delete("/:id", studentController.deleteStudent);

export default router;
