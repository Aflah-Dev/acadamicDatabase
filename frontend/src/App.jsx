import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import StudentRegistrationPage from "./pages/StudentRegistrationPage";
import ClassManagementPage from "./pages/ClassManagementPage";
import SubjectManagementPage from "./pages/SubjectManagementPage";
import MarkEntryPage from "./pages/MarkEntryPage";
import AcademicReportPage from "./pages/AcademicReportPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto w-full max-w-[1700px] px-4 pb-10 pt-28 lg:pl-[240px] lg:pr-8 lg:pt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentRegistrationPage />} />
            <Route path="/classes" element={<ClassManagementPage />} />
            <Route path="/subjects" element={<SubjectManagementPage />} />
            <Route path="/marks" element={<MarkEntryPage />} />
            <Route path="/reports" element={<AcademicReportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
