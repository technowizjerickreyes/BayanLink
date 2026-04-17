import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-bayan-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3">
        {/* Logo & Brand - with Municipality Seal */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_Nueva_Ecija-dieHQ6M42us6abrNxyS40PP1QYjKUX.png"
            alt="Municipality of Aliaga Official Seal"
            className="h-12 w-12"
          />
          <div className="hidden sm:block">
            <strong className="block text-sm">BayanLink</strong>
            <small className="block text-xs text-bayan-muted">Aliaga Municipal Portal</small>
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
          <Link to="/signup" className="button ghost hidden text-sm sm:inline-flex">
            Sign Up
          </Link>
          <Link to="/login" className="button primary text-sm hidden sm:inline-flex">
            Sign In
          </Link>
          <div className="relative group">
            <button className="button primary text-sm sm:hidden">
              Menu
            </button>
            <div className="absolute right-0 top-full hidden min-w-[200px] flex-col gap-2 border border-bayan-border bg-white p-3 shadow-card group-hover:flex">
              <Link to="/signup" className="rounded px-3 py-2 text-sm hover:bg-bayan-surface font-bold">
                Create Account
              </Link>
              <Link to="/login" className="rounded px-3 py-2 text-sm hover:bg-bayan-surface">
                Sign In
              </Link>
              <hr className="my-2 border-bayan-border" />
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
