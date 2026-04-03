import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/students", label: "Students" },
    { path: "/classes", label: "Classes" },
    { path: "/subjects", label: "Subjects" },
    { path: "/marks", label: "Mark Entry" },
    { path: "/reports", label: "Reports" },
  ];

  const getLinkClass = (path) =>
    `sidebar-link ${isActive(path) ? "sidebar-link-active" : ""}`;

  const getMobileTabClass = (path) =>
    `shrink-0 border-b-2 pb-2 text-sm font-semibold transition ${
      isActive(path)
        ? "border-[#2d7a47] text-[#1f5f36]"
        : "border-transparent text-slate-500 hover:text-slate-700"
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#ced9cf] bg-white px-4 py-3 lg:hidden">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold tracking-tight text-[#173727]">
              EduTrack
            </p>
            <p className="text-[11px] text-slate-500">Academic Record System</p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2d7a47]">
            Live
          </span>
        </div>

        <nav className="mt-3 flex gap-4 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={getMobileTabClass(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[230px] border-r border-[#dde7de] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#edf2ee] px-5 py-7">
          <p className="text-2xl font-bold tracking-tight text-[#173727]">
            EduTrack
          </p>
          <p className="text-xs text-slate-500">Academic Record System</p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={getLinkClass(link.path)}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
