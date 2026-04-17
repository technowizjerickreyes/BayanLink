import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-bayan-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="brand-mark">B</div>
          <div className="hidden sm:block">
            <strong className="block text-sm">BayanLink</strong>
            <small className="block text-xs">Aliaga Portal</small>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/" className="text-sm font-bold text-bayan-ink transition hover:text-bayan-teal">
            Home
          </Link>
          <Link to="/about" className="text-sm font-bold text-bayan-ink transition hover:text-bayan-teal">
            About
          </Link>
          <Link to="/services" className="text-sm font-bold text-bayan-ink transition hover:text-bayan-teal">
            Services
          </Link>
          <Link to="/news" className="text-sm font-bold text-bayan-ink transition hover:text-bayan-teal">
            News
          </Link>
        </div>

        {/* Login Buttons */}
        <div className="flex items-center gap-2">
          <Link to="/citizen/login" className="button ghost hidden text-sm sm:inline-flex">
            Login
          </Link>
          <div className="relative group">
            <button className="button primary text-sm">
              Portals
            </button>
            <div className="absolute right-0 top-full hidden min-w-[200px] flex-col gap-2 border border-bayan-border bg-white p-3 shadow-card group-hover:flex">
              <Link to="/citizen/login" className="rounded px-3 py-2 text-sm hover:bg-bayan-surface">
                Citizen Portal
              </Link>
              <Link to="/barangay/login" className="rounded px-3 py-2 text-sm hover:bg-bayan-surface">
                Barangay Admin
              </Link>
              <Link to="/municipal/login" className="rounded px-3 py-2 text-sm hover:bg-bayan-surface">
                Municipal Admin
              </Link>
              <Link to="/super-admin/login" className="rounded px-3 py-2 text-sm hover:bg-bayan-surface">
                Super Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
