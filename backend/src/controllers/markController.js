import * as markService from "../services/markService.js";

export const createMark = async (req, res, next) => {
  try {
    const { student_id, subject_id, mark_obtained, semester, academic_year } = req.body;
    const mark = await markService.createMark(student_id, subject_id, mark_obtained, semester, academic_year);
    res.status(201).json(mark);
  } catch (error) {
    next(error);
  }
};

export const getAllMarks = async (req, res, next) => {
  try {
    const filters = {
      student_id: req.query.student_id,
      subject_id: req.query.subject_id,
      semester: req.query.semester,
      academic_year: req.query.academic_year
    };
    const marks = await markService.getAllMarks(filters);
    res.json(marks);
  } catch (error) {
    next(error);
  }
};

export const getMarkById = async (req, res, next) => {
  try {
    const mark = await markService.getMarkById(req.params.id);
    res.json(mark);
  } catch (error) {
    next(error);
  }
};

export const updateMark = async (req, res, next) => {
  try {
    const { mark_obtained } = req.body;
    const mark = await markService.updateMark(req.params.id, mark_obtained);
    res.json(mark);
  } catch (error) {
    next(error);
  }
};

export const deleteMark = async (req, res, next) => {
  try {
    const result = await markService.deleteMark(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
