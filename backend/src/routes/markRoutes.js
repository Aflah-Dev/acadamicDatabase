import { Router } from 'express';
import * as markController from '../controllers/markController.js';
import {
  validateRequired,
  validatePositiveInt,
  validateMark,
  validateSemester,
} from '../middlewares/validator.js';
const router = Router();

router.post('/', 
  validateRequired(['student_id', 'subject_id', 'mark_obtained', 'semester', 'academic_year']),
  validatePositiveInt('student_id'),
  validatePositiveInt('subject_id'),
  validateMark,
  validateSemester,
  markController.createMark
);

router.get('/', markController.getAllMarks);
router.get('/:id', markController.getMarkById);

router.put('/:id',
  validateRequired(['mark_obtained']),
  validateMark,
  markController.updateMark
);

router.delete('/:id', markController.deleteMark);

export default router;
