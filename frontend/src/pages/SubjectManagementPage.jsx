import { useState, useEffect } from "react";
import { subjectAPI, departmentAPI } from "../services/api";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department_id: "",
    total_mark: "100",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectAPI.getAll();
      setSubjects(data);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await departmentAPI.getAll();
      setDepartments(data);
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
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.department_id
    ) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await subjectAPI.update(editingId, formData);
        setMessage({ type: "success", text: "Subject updated successfully!" });
        setEditingId(null);
      } else {
        await subjectAPI.create(formData);
        setMessage({ type: "success", text: "Subject created successfully!" });
      }

      setFormData({ name: "", code: "", department_id: "", total_mark: "100" });
      fetchSubjects();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      department_id: subject.department_id.toString(),
      total_mark: subject.total_mark.toString(),
    });
    setEditingId(subject.subject_id);
    setMessage({ type: "", text: "" });
  };

  const openDeleteModal = (subject) => {
    setDeleteTarget(subject);
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
      await subjectAPI.delete(deleteTarget.subject_id);
      setMessage({ type: "success", text: "Subject deleted successfully!" });
      setDeleteTarget(null);
      fetchSubjects();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", department_id: "", total_mark: "100" });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="fade-in mx-auto max-w-7xl">
      <h1 className="page-title">Subject Management</h1>
      <p className="page-subtitle">
        Maintain subjects and departments in one streamlined panel.
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.35fr]">
        <div className="panel p-6 md:p-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            {editingId ? "Edit Subject" : "Add New Subject"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="field-label">
                  Subject Name *
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
                <label htmlFor="code" className="field-label">
                  Subject Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="field-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="total_mark" className="field-label">
                  Total Mark *
                </label>
                <input
                  type="number"
                  id="total_mark"
                  name="total_mark"
                  value={formData.total_mark}
                  onChange={handleChange}
                  min="1"
                  className="field-input"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="department_id" className="field-label">
                  Department *
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="field-input"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.name}
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
                    ? "Update Subject"
                    : "Add Subject"}
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
            <h2 className="text-xl font-semibold text-slate-800">
              Subjects List
            </h2>
            <span className="status-chip status-chip-neutral">
              {subjects.length} records
            </span>
          </div>

          <div className="max-h-[32rem] table-wrap">
            {subjects.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 py-6 text-center text-sm text-slate-500">
                No subjects found
              </p>
            ) : (
              <table className="table-clean min-w-full md:min-w-[720px]">
                <thead>
                  <tr className="bg-[#edf5e8]">
                    <th>Subject</th>
                    <th>Code</th>
                    <th className="hidden sm:table-cell">Department</th>
                    <th className="hidden md:table-cell">Total Mark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr
                      key={subject.subject_id}
                      className="border-t border-[#dbe7d4] bg-[#f9fcf8] text-[#2f4338]"
                    >
                      <td className="font-semibold text-slate-800">
                        {subject.name}
                      </td>
                      <td>{subject.code}</td>
                      <td className="hidden sm:table-cell">
                        {subject.department_name}
                      </td>
                      <td className="hidden md:table-cell">
                        {subject.total_mark}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(subject)}
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
        title="Delete Subject"
        description="This will permanently remove the subject and related mark entries may no longer be valid."
        itemName={
          deleteTarget ? `${deleteTarget.name} (${deleteTarget.code})` : ""
        }
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SubjectManagementPage;
