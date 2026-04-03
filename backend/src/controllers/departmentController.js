import * as departmentService from "../services/departmentService.js";
// Create department
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const department = await departmentService.createDepartment(name, code);
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

// Get all departments
export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

// Get department by ID
export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.json(department);
  } catch (error) {
    next(error);
  }
};

// Update department
export const updateDepartment = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const department = await departmentService.updateDepartment(req.params.id, name, code);
    res.json(department);
  } catch (error) {
    next(error);
  }
};

// Delete department
export const deleteDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.deleteDepartment(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
