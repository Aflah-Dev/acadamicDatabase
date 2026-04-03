import { useEffect, useMemo, useState } from "react";
import { reportAPI, studentAPI, subjectAPI, teacherAPI } from "../services/api";

const HomePage = () => {
  const [dashboard, setDashboard] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    passNumerator: 0,
    passDenominator: 0,
    reports: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    const [studentsResult, teachersResult, subjectsResult, reportsResult] =
      await Promise.allSettled([
        studentAPI.getAll(),
        teacherAPI.getAll(),
        subjectAPI.getAll(),
        reportAPI.getReports(),
      ]);

    const students =
      studentsResult.status === "fulfilled" &&
      Array.isArray(studentsResult.value)
        ? studentsResult.value
        : [];
    const teachers =
      teachersResult.status === "fulfilled" &&
      Array.isArray(teachersResult.value)
        ? teachersResult.value
        : [];
    const subjects =
      subjectsResult.status === "fulfilled" &&
      Array.isArray(subjectsResult.value)
        ? subjectsResult.value
        : [];
    const reports =
      reportsResult.status === "fulfilled" && Array.isArray(reportsResult.value)
        ? reportsResult.value
        : [];

    const passNumerator = reports.filter((r) => r.status === "PASS").length;

    if (
      studentsResult.status === "rejected" ||
      teachersResult.status === "rejected" ||
      subjectsResult.status === "rejected" ||
      reportsResult.status === "rejected"
    ) {
      setError("Some dashboard data could not be loaded.");
    }

    setDashboard({
      students: students.length,
      teachers: teachers.length,
      subjects: subjects.length,
      passNumerator,
      passDenominator: reports.length,
      reports,
    });
    setLoading(false);
  };

  const topReports = useMemo(() => {
    return [...dashboard.reports]
      .sort(
        (a, b) =>
          (a.rank ?? Number.MAX_SAFE_INTEGER) -
          (b.rank ?? Number.MAX_SAFE_INTEGER),
      )
      .slice(0, 5);
  }, [dashboard.reports]);

  const statItems = [
    {
      key: "students",
      label: "Students",
      value: dashboard.students,
    },
    {
      key: "teachers",
      label: "Teachers",
      value: dashboard.teachers,
    },
    {
      key: "subjects",
      label: "Subjects",
      value: dashboard.subjects,
    },
    {
      key: "pass-rate",
      label: "Pass Rate",
      value: `${dashboard.passNumerator}/${dashboard.passDenominator}`,
    },
  ];

  return (
    <div className="fade-in space-y-5">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of academic records</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <section className="border-y border-[#dde7de] bg-white">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#dbe7d4] sm:grid-cols-4 sm:divide-y-0">
          {statItems.map((item) => (
            <div key={item.key} className="px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-3xl font-extrabold leading-none text-[#244f32]">
                {loading ? "-" : item.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#4f715f]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border border-[#dde7de] bg-white">
        <div className="border-b border-[#d5e2cd] px-5 py-4">
          <h2 className="text-[1.5rem] font-semibold text-[#245435] md:text-[1.75rem]">
            Quick Report Summary
          </h2>
        </div>

        <div className="table-wrap">
          <table className="table-clean min-w-full">
            <thead>
              <tr className="bg-[#edf5e8]">
                <th>Student</th>
                <th className="hidden sm:table-cell">Total /500</th>
                <th>Avg</th>
                <th>Status</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-sm text-slate-500" colSpan={5}>
                    Loading dashboard summary...
                  </td>
                </tr>
              ) : topReports.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-sm text-slate-500" colSpan={5}>
                    No reports found
                  </td>
                </tr>
              ) : (
                topReports.map((report, index) => (
                  <tr
                    key={`${report.student_id}-${report.academic_year}-${report.semester}-${index}`}
                    className="border-t border-[#dbe7d4] bg-[#f9fcf8] text-sm text-[#2f4338]"
                  >
                    <td className="font-semibold">
                      {report.student_school_id || report.student_name || "-"}
                    </td>
                    <td className="hidden sm:table-cell">
                      {report.total_marks ?? 0}
                    </td>
                    <td>{Number(report.average_score ?? 0).toFixed(1)}</td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          report.status === "PASS"
                            ? "bg-[#d8eed0] text-[#2f7d42]"
                            : "bg-[#f6decf] text-[#b96f45]"
                        }`}
                      >
                        {report.status || "-"}
                      </span>
                    </td>
                    <td className="font-bold text-[#2f7d42]">
                      {report.rank ?? "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
