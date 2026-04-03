import { useEffect, useState } from "react";
import { classAPI, teacherAPI } from "../services/api";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class_name: "",
    grade: "9",
    academic_year: "2024-2025",
    semester: "I",
    homeroom_teacher_id: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await classAPI.getAll();
      setClasses(data);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await teacherAPI.getAll();
      setTeachers(data);
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

    if (!formData.class_name.trim() || !formData.homeroom_teacher_id) {
      setMessage({
        type: "error",
        text: "Class Name and Homeroom Teacher are required",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await classAPI.update(editingId, formData);
        setMessage({ type: "success", text: "Class updated successfully!" });
      } else {
        await classAPI.create(formData);
        setMessage({ type: "success", text: "Class created successfully!" });
      }

      setEditingId(null);
      setFormData({
        class_name: "",
        grade: "9",
        academic_year: "2024-2025",
        semester: "I",
        homeroom_teacher_id: "",
      });
      fetchClasses();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls.class_id);
    setFormData({
      class_name: cls.class_name,
      grade: cls.grade,
      academic_year: cls.academic_year,
      semester: cls.semester,
      homeroom_teacher_id: cls.homeroom_teacher_id.toString(),
    });
    setMessage({ type: "", text: "" });
  };

  const openDeleteModal = (cls) => {
    setDeleteTarget(cls);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);
    try {
      await classAPI.delete(deleteTarget.class_id);
      setMessage({ type: "success", text: "Class deleted successfully!" });
      setDeleteTarget(null);
      fetchClasses();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      class_name: "",
      grade: "9",
      academic_year: "2024-2025",
      semester: "I",
      homeroom_teacher_id: "",
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="fade-in mx-auto max-w-7xl">
      <h1 className="page-title">Class Management</h1>
      <p className="page-subtitle">
        Create and maintain class-term structures with homeroom assignments.
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.35fr]">
        <div className="panel p-6 md:p-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            {editingId ? "Edit Class" : "Add New Class"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="class_name" className="field-label">
                  Class Name *
                </label>
                <input
                  type="text"
                  id="class_name"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  placeholder="e.g., 10A"
                  className="field-input"
                  required
                />
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
                  className="field-input"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="homeroom_teacher_id" className="field-label">
                  Homeroom Teacher *
                </label>
                <select
                  id="homeroom_teacher_id"
                  name="homeroom_teacher_id"
                  value={formData.homeroom_teacher_id}
                  onChange={handleChange}
                  className="field-input"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.name} ({teacher.department_name})
                    </option>
                  ))}
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

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="btn-brand flex-1"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Class"
                    : "Add Class"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-neutral"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Class List</h2>
            <span className="status-chip status-chip-neutral">
              {classes.length} records
            </span>
          </div>

          <div className="max-h-[32rem] table-wrap">
            {classes.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 py-6 text-center text-sm text-slate-500">
                No classes found
              </p>
            ) : (
              <table className="table-clean min-w-full md:min-w-[740px]">
                <thead>
                  <tr className="bg-[#edf5e8]">
                    <th>Class</th>
                    <th>Grade</th>
                    <th className="hidden sm:table-cell">Year / Semester</th>
                    <th className="hidden md:table-cell">Homeroom</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr
                      key={cls.class_id}
                      className="border-t border-[#dbe7d4] bg-[#f9fcf8] text-[#2f4338]"
                    >
                      <td className="font-semibold text-slate-800">
                        {cls.class_name}
                      </td>
                      <td>{cls.grade}</td>
                      <td className="hidden sm:table-cell">
                        {cls.academic_year} / {cls.semester}
                      </td>
                      <td className="hidden md:table-cell">
                        {cls.homeroom_teacher_name}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cls)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(cls)}
                            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Class"
        description="This action cannot be undone. Students assigned to this class may also be affected."
        itemName={deleteTarget ? deleteTarget.class_name : ""}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ClassManagementPage;
