import { useState, useEffect } from "react";
import { markAPI, studentAPI, subjectAPI } from "../services/api";

const MarkEntryPage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    subject_id: "",
    mark_obtained: "",
    semester: "I",
    academic_year: "2024-2025",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentAPI.getAll();
      setStudents(data);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await subjectAPI.getAll();
      setSubjects(data);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Client-side validation
    if (
      !formData.student_id ||
      !formData.subject_id ||
      !formData.mark_obtained
    ) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    const mark = parseInt(formData.mark_obtained);
    if (isNaN(mark) || mark < 0 || mark > 100) {
      setMessage({ type: "error", text: "Mark must be between 0 and 100" });
      return;
    }

    setLoading(true);
    try {
      await markAPI.create({
        ...formData,
        mark_obtained: mark,
      });
      setMessage({ type: "success", text: "Mark recorded successfully!" });
      // Reset form
      setFormData({
        student_id: "",
        subject_id: "",
        mark_obtained: "",
        semester: "I",
        academic_year: "2024-2025",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in mx-auto max-w-4xl">
      <h1 className="page-title">Mark Entry</h1>
      <p className="page-subtitle">
        Record subject scores with built-in validation and term control.
      </p>

      <div className="panel p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="student_id" className="field-label">
                Student *
              </label>
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_school_id} - {student.name} (
                    {student.class_name || `Grade ${student.grade}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="subject_id" className="field-label">
                Subject *
              </label>
              <select
                id="subject_id"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mark_obtained" className="field-label">
                Mark Obtained (0-100) *
              </label>
              <input
                type="number"
                id="mark_obtained"
                name="mark_obtained"
                value={formData.mark_obtained}
                onChange={handleChange}
                min="0"
                max="100"
                className="field-input"
                required
              />
            </div>

            <div>
              <label htmlFor="semester" className="field-label">
                Semester *
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="I">Semester I</option>
                <option value="II">Semester II</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="academic_year" className="field-label">
                Academic Year *
              </label>
              <input
                type="text"
                id="academic_year"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                placeholder="e.g., 2024-2025"
                className="field-input"
                required
              />
            </div>
          </div>

          {message.text && (
            <div
              className={
                message.type === "success" ? "alert-ok" : "alert-error"
              }
            >
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-brand w-full">
            {loading ? "Recording..." : "Record Mark"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarkEntryPage;
