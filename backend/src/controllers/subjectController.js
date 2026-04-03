import * as subjectService from "../services/subjectService.js";

export const createSubject = async (req, res, next) => {
  try {
    const { name, code, department_id, total_mark } = req.body;
    const subject = await subjectService.createSubject(name, code, department_id, total_mark);
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

export const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const { name, code, department_id, total_mark } = req.body;
    const subject = await subjectService.updateSubject(req.params.id, name, code, department_id, total_mark);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
