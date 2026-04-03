import { Router } from 'express';
import * as teacherController from '../controllers/teacherController.js';
import {
  validateRequired,
  validateEmail,
  validatePositiveInt,
} from '../middlewares/validator.js';

const router = Router();

router.post('/', 
  validateRequired(['name', 'email', 'department_id']),
  validateEmail,
  validatePositiveInt('department_id'),
  teacherController.createTeacher
);

router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);

router.put('/:id',
  validateRequired(['name', 'email', 'department_id']),
  validateEmail,
  validatePositiveInt('department_id'),
  teacherController.updateTeacher
);

router.delete('/:id', teacherController.deleteTeacher);

export default router;
