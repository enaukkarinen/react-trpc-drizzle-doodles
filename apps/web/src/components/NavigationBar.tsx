import { NavLink } from "react-router-dom";

export function NavigationBar() {
  const pages = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Chat", to: "/chat" },
    { name: "Map", to: "/map" },
  ];

  return (
    <nav className="border-b border-slate-800 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-center gap-8">
          {pages.map((page) => (
            <NavLink
              key={page.to}
              to={page.to}
              end={page.to === "/"}
              className={({ isActive }) =>
                [
                  "text-sm font-medium tracking-wide transition-colors",
                  isActive
                    ? "text-brand-300 relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-brand-300 after:opacity-80"
                    : "text-slate-400 hover:text-brand-200",
                ].join(" ")
              }
            >
              {page.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
