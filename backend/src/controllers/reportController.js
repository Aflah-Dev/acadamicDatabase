import * as reportService from "../services/reportService.js";

export const getAcademicReports = async (req, res, next) => {
  try {
    const filters = {
      grade: req.query.grade,
      academic_year: req.query.academic_year,
      semester: req.query.semester,
      student_id: req.query.student_id,
      student_school_id: req.query.student_school_id,
    };
    const reports = await reportService.getAcademicReports(filters);
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const getStudentReport = async (req, res, next) => {
  try {
    const report = await reportService.getStudentReport(req.params.student_id);
    res.json(report);
  } catch (error) {
    next(error);
  }
};
