import { useState, useEffect } from "react";
import { reportAPI } from "../services/api";

const AcademicReportPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    grade: "",
    academic_year: "",
    semester: "",
    student_school_id: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reports, filters, sortConfig]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportAPI.getReports();
      setReports(data);
      setMessage({ type: "", text: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...reports];

    // Apply filters
    if (filters.grade) {
      filtered = filtered.filter((r) => r.grade === filters.grade);
    }
    if (filters.academic_year) {
      filtered = filtered.filter(
        (r) => r.academic_year === filters.academic_year,
      );
    }
    if (filters.semester) {
      filtered = filtered.filter((r) => r.semester === filters.semester);
    }
    if (filters.student_school_id) {
      filtered = filtered.filter(
        (r) => r.student_school_id === filters.student_school_id,
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const clearFilters = () => {
    setFilters({
      grade: "",
      academic_year: "",
      semester: "",
      student_school_id: "",
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="fade-in mx-auto max-w-7xl">
      <h1 className="page-title">Academic Reports</h1>
      <p className="page-subtitle">
        Filter, sort, and compare student performance across terms.
      </p>

      <div className="panel mb-6 p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          <span className="status-chip status-chip-neutral">
            {filteredReports.length} matched
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="grade" className="field-label">
              Grade
            </label>
            <select
              id="grade"
              name="grade"
              value={filters.grade}
              onChange={handleFilterChange}
              className="field-input"
            >
              <option value="">All Grades</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div>
            <label htmlFor="academic_year" className="field-label">
              Academic Year
            </label>
            <input
              type="text"
              id="academic_year"
              name="academic_year"
              value={filters.academic_year}
              onChange={handleFilterChange}
              placeholder="e.g., 2024-2025"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="semester" className="field-label">
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="field-input"
            >
              <option value="">All Semesters</option>
              <option value="I">Semester I</option>
              <option value="II">Semester II</option>
            </select>
          </div>

          <div>
            <label htmlFor="student_school_id" className="field-label">
              Student School ID
            </label>
            <input
              type="text"
              id="student_school_id"
              name="student_school_id"
              value={filters.student_school_id}
              onChange={handleFilterChange}
              placeholder="e.g., STD-001"
              className="field-input"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={clearFilters} className="btn-neutral">
            Clear Filters
          </button>
          <button onClick={fetchReports} className="btn-brand">
            Refresh
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-4 ${message.type === "success" ? "alert-ok" : "alert-error"}`}
        >
          {message.text}
        </div>
      )}

      <div className="panel overflow-hidden p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading...
          </div>
        ) : currentReports.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No reports found
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table-clean min-w-full lg:min-w-[1080px]">
                <thead>
                  <tr className="bg-[#edf5e8]">
                    <th
                      onClick={() => handleSort("rank")}
                      className="cursor-pointer hover:bg-[#e4efde]"
                    >
                      Rank{" "}
                      {sortConfig.key === "rank" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th>Student ID</th>
                    <th className="hidden sm:table-cell">Student Name</th>
                    <th className="hidden md:table-cell">Class</th>
                    <th className="hidden lg:table-cell">Year/Sem</th>
                    <th className="hidden xl:table-cell">Maths</th>
                    <th className="hidden xl:table-cell">English</th>
                    <th className="hidden xl:table-cell">Biology</th>
                    <th className="hidden xl:table-cell">Chemistry</th>
                    <th className="hidden xl:table-cell">Physics</th>
                    <th
                      onClick={() => handleSort("total_marks")}
                      className="cursor-pointer hover:bg-[#e4efde]"
                    >
                      Total (/500){" "}
                      {sortConfig.key === "total_marks" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      onClick={() => handleSort("average_score")}
                      className="cursor-pointer hover:bg-[#e4efde]"
                    >
                      Average{" "}
                      {sortConfig.key === "average_score" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReports.map((report) => (
                    <tr
                      key={`${report.student_id}-${report.academic_year}-${report.semester}`}
                      className="border-t border-[#dbe7d4] bg-[#f9fcf8]"
                    >
                      <td className="font-semibold text-slate-800">
                        {report.rank}
                      </td>
                      <td className="font-semibold text-slate-700">
                        {report.student_school_id}
                      </td>
                      <td className="hidden sm:table-cell text-slate-700">
                        {report.student_name}
                      </td>
                      <td className="hidden md:table-cell text-slate-500">
                        {report.class_name || "-"}
                      </td>
                      <td className="hidden lg:table-cell text-slate-500">
                        {report.academic_year} / {report.semester}
                      </td>
                      <td className="hidden xl:table-cell text-slate-500">
                        {report.maths_mark ?? "-"}
                      </td>
                      <td className="hidden xl:table-cell text-slate-500">
                        {report.english_mark ?? "-"}
                      </td>
                      <td className="hidden xl:table-cell text-slate-500">
                        {report.biology_mark ?? "-"}
                      </td>
                      <td className="hidden xl:table-cell text-slate-500">
                        {report.chemistry_mark ?? "-"}
                      </td>
                      <td className="hidden xl:table-cell text-slate-500">
                        {report.physics_mark ?? "-"}
                      </td>
                      <td className="font-medium text-slate-800">
                        {report.total_marks}
                      </td>
                      <td className="font-medium text-slate-800">
                        {parseFloat(report.average_score).toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`status-chip ${
                            report.status === "PASS"
                              ? "status-chip-success"
                              : "status-chip-danger"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
                <div className="text-sm text-slate-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredReports.length)} of{" "}
                  {filteredReports.length} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-neutral disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                            currentPage === page
                              ? "bg-emerald-600 text-white"
                              : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-neutral disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AcademicReportPage;
