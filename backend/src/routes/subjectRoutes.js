import { Router } from 'express';
import * as subjectController from '../controllers/subjectController.js';
import {
  validateRequired,
  validatePositiveInt,
} from '../middlewares/validator.js';

const router = Router();

router.post('/', 
  validateRequired(['name', 'code', 'department_id']),
  validatePositiveInt('department_id'),
  validatePositiveInt('total_mark'),
  subjectController.createSubject
);

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);

router.put('/:id',
  validateRequired(['name', 'code', 'department_id', 'total_mark']),
  validatePositiveInt('department_id'),
  validatePositiveInt('total_mark'),
  subjectController.updateSubject
);

router.delete('/:id', subjectController.deleteSubject);

export default router;
