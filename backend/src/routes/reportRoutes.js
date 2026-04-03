import { Router } from 'express';
import * as reportController from '../controllers/reportController.js';

const router = Router();

router.get('/', reportController.getAcademicReports);
router.get('/:student_id', reportController.getStudentReport);

export default router;
