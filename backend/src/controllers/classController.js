import * as classService from "../services/classService.js"

export const createClass = async (req, res, next) => {
  try {
    const { class_name, grade, academic_year, semester, homeroom_teacher_id } =
      req.body;
    const cls = await classService.createClass(
      class_name,
      grade,
      academic_year,
      semester,
      homeroom_teacher_id,
    );
    res.status(201).json(cls);
  } catch (error) {
    next(error);
  }
};

export const getAllClasses = async (req, res, next) => {
  try {
    const classes = await classService.getAllClasses();
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (req, res, next) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    res.json(cls);
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const { class_name, grade, academic_year, semester, homeroom_teacher_id } =
      req.body;
    const cls = await classService.updateClass(
      req.params.id,
      class_name,
      grade,
      academic_year,
      semester,
      homeroom_teacher_id,
    );
    res.json(cls);
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
