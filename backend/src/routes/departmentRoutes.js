import { Router } from 'express';
import * as departmentController from '../controllers/departmentController.js';
import { validateRequired } from '../middlewares/validator.js';
const router = Router();

// POST /api/departments - Create new department
router.post('/', 
  validateRequired(['name', 'code']),
  departmentController.createDepartment
);

// GET /api/departments - Get all departments
router.get('/', departmentController.getAllDepartments);

// GET /api/departments/:id - Get department by ID
router.get('/:id', departmentController.getDepartmentById);

// PUT /api/departments/:id - Update department
router.put('/:id',
  validateRequired(['name', 'code']),
  departmentController.updateDepartment
);

// DELETE /api/departments/:id - Delete department
router.delete('/:id', departmentController.deleteDepartment);

export default router;
