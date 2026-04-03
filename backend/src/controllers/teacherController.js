import * as teacherService from "../services/teacherService.js";

export const createTeacher = async (req, res, next) => {
  try {
    const { name, email, department_id } = req.body;
    const teacher = await teacherService.createTeacher(name, email, department_id);
    res.status(201).json(teacher);
  } catch (error) {
    next(error);
  }
};

export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

export const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const { name, email, department_id } = req.body;
    const teacher = await teacherService.updateTeacher(req.params.id, name, email, department_id);
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const result = await teacherService.deleteTeacher(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
