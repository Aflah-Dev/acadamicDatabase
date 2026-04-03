import { Router } from "express";
import * as classController from "../controllers/classController.js";
import {
  validateRequired,
  validateGrade,
  validateSemester,
  validatePositiveInt,
} from "../middlewares/validator.js";

const router = Router();

router.post(
  "/",
  validateRequired([
    "class_name",
    "grade",
    "academic_year",
    "semester",
    "homeroom_teacher_id",
  ]),
  validateGrade,
  validateSemester,
  validatePositiveInt("homeroom_teacher_id"),
  classController.createClass,
);

router.get("/", classController.getAllClasses);
router.get("/:id", classController.getClassById);

router.put(
  "/:id",
  validateRequired([
    "class_name",
    "grade",
    "academic_year",
    "semester",
    "homeroom_teacher_id",
  ]),
  validateGrade,
  validateSemester,
  validatePositiveInt("homeroom_teacher_id"),
  classController.updateClass,
);

router.delete("/:id", classController.deleteClass);

export default router;
