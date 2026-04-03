import * as studentService from "../services/studentService.js";

export const createStudent = async (req, res, next) => {
  try {
    const {
      student_school_id,
      name,
      gender,
      class_id,
      grade,
      academic_year,
      semester,
    } = req.body;
    const student = await studentService.createStudent(
      student_school_id,
      name,
      gender,
      class_id,
      grade,
      academic_year,
      semester,
    );
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const {
      student_school_id,
      name,
      gender,
      class_id,
      grade,
      academic_year,
      semester,
    } = req.body;
    const student = await studentService.updateStudent(
      req.params.id,
      student_school_id,
      name,
      gender,
      class_id,
      grade,
      academic_year,
      semester,
    );
    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
