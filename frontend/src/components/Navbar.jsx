import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/home" },
  { label: "Genres", to: "/genres" },
  { label: "Movies", to: "/all-movies" },
  { label: "Bookings", to: "/all-bookings" },
];

const Navbar = () => {
  const token = localStorage.getItem("accessToken");

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E1A]/95 backdrop-blur border-b border-dashed border-[#262B42]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <NavLink to="/home" className="flex items-center gap-2.5 group">
          {/* <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-[#7C5CFC] font-mono-tix text-sm font-bold text-[#0B0E1A] shadow-[0_0_16px_rgba(124,92,252,0.55)] transition-shadow group-hover:shadow-[0_0_22px_rgba(124,92,252,0.8)]">
            C
          </span> */}
          <span className="font-mono-tix text-lg font-bold tracking-wide text-[#E7E9F5]">
            CINE<span className="text-[#22D3EE]">FLIX</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 font-mono-tix text-xs font-medium uppercase tracking-widest transition ${
                  isActive
                    ? "bg-[#1B2033] text-[#22D3EE] shadow-[inset_0_0_0_1px_#2E3550]"
                    : "text-[#8A90A8] hover:text-[#E7E9F5]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <NavLink
                to="/login"
                className="rounded-md border border-[#3B4256] px-4 py-2 font-mono-tix text-xs font-semibold uppercase tracking-widest text-[#E7E9F5] transition hover:border-[#7C5CFC] hover:text-[#22D3EE]"
              >
                Login
              </NavLink>
              <NavLink
                to="/sign-up"
                className="rounded-md bg-[#7C5CFC] px-4 py-2 font-mono-tix text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_14px_rgba(124,92,252,0.45)] transition hover:bg-[#8F72FF]"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                window.location.href = "/home";
              }}
              className="rounded-md border border-[#3B4256] px-4 py-2 font-mono-tix text-xs font-semibold uppercase tracking-widest text-[#8A90A8] transition hover:border-[#FB7185] hover:text-[#FB7185]"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
