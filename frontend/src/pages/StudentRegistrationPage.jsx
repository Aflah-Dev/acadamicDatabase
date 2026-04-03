import { useEffect, useState } from "react";
import { classAPI, studentAPI } from "../services/api";

const StudentRegistrationPage = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    student_school_id: "",
    name: "",
    gender: "M",
    class_id: "",
    grade: "9",
    academic_year: "2024-2025",
    semester: "I",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await classAPI.getAll();
      setClasses(data);
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

    if (
      !formData.student_school_id.trim() ||
      !formData.name.trim() ||
      !formData.class_id
    ) {
      setMessage({
        type: "error",
        text: "Student ID, Name, and Class are required",
      });
      return;
    }

    setLoading(true);
    try {
      await studentAPI.create(formData);
      setMessage({ type: "success", text: "Student registered successfully!" });
      setFormData({
        student_school_id: "",
        name: "",
        gender: "M",
        class_id: "",
        grade: "9",
        academic_year: "2024-2025",
        semester: "I",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in mx-auto max-w-3xl">
      <h1 className="page-title">Student Registration</h1>
      <p className="page-subtitle">
        Create student records and map them directly to active class terms.
      </p>

      <div className="panel p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="class_id" className="field-label">
                Class *
              </label>
              <select
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name} - Grade {cls.grade} ({cls.academic_year},
                    Sem {cls.semester})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="student_school_id" className="field-label">
                Student ID *
              </label>
              <input
                type="text"
                id="student_school_id"
                name="student_school_id"
                value={formData.student_school_id}
                onChange={handleChange}
                placeholder="e.g., STD-009"
                className="field-input"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="field-label">
                Student Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="field-label">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="grade" className="field-label">
                Grade *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="field-input"
                required
              >
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <div>
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
            {loading ? "Registering..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
