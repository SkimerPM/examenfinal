import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const links = [
    { to: "/", label: "Facultades" },
    { to: "/cursos", label: "Cursos" },
  ];
  return (
    <header
      className="w-full fixed top-0 left-0 z-40"
      style={{ animation: "fadein 0.7s" }}
    >
      <nav className="max-w-3xl mx-auto bg-white/60 backdrop-blur-lg border border-rose-100 rounded-2xl shadow-lg mt-6 px-8 py-3 flex items-center justify-between">
        <span className="text-2xl font-black tracking-tighter text-rose-700 drop-shadow-sm select-none">
          Jhomil Uni
        </span>
        <div className="flex gap-4 items-center">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                `px-4 py-1 rounded-lg font-medium text-neutral-800 hover:bg-rose-100 hover:text-rose-700 transition-all duration-150 shadow-sm cursor-pointer no-underline ` +
                (location.pathname === link.to
                  ? "bg-rose-50 text-rose-700 font-bold scale-105"
                  : "")
              }
              style={{ fontFamily: "Inter" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <style>{`
        @keyframes fadein {from { opacity: 0; transform: translateY(-24px);} to { opacity: 1; transform: none;}}
      `}</style>
    </header>
  );
}
