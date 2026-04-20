import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bayan-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aliaga_Nueva_Ecija-dieHQ6M42us6abrNxyS40PP1QYjKUX.png"
            alt="Municipality of Aliaga Official Seal"
            className="h-12 w-12"
          />
          <div className="hidden sm:block">
            <strong className="block text-sm font-black text-bayan-ink">BayanLink</strong>
            <small className="block text-xs text-bayan-muted">Aliaga Municipal Portal</small>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-5 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            { to: "/news", label: "News" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `text-sm font-bold transition ${isActive ? "text-bayan-teal" : "text-bayan-ink hover:text-bayan-teal"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/signup" className="button ghost text-sm">
            Sign Up
          </Link>
          <Link to="/login" className="button primary text-sm">
            Sign In
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="icon-button md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
        >
          {mobileOpen ? (
            <svg aria-hidden="true" fill="none" height={18} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width={18}>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg aria-hidden="true" fill="none" height={18} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width={18}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-bayan-border bg-white px-4 py-4 md:hidden">
          <nav className="grid gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/news", label: "News" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-bold text-bayan-ink transition hover:bg-bayan-surface hover:text-bayan-teal"
              >
                {label}
              </Link>
            ))}
            <hr className="my-2 border-bayan-border" />
            <Link to="/citizen/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-bayan-ink transition hover:bg-bayan-surface hover:text-bayan-teal">
              Citizen Portal
            </Link>
            <Link to="/barangay/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-bayan-ink transition hover:bg-bayan-surface hover:text-bayan-teal">
              Barangay Admin
            </Link>
            <Link to="/municipal/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-bayan-ink transition hover:bg-bayan-surface hover:text-bayan-teal">
              Municipal Admin
            </Link>
            <Link to="/super-admin/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-bayan-ink transition hover:bg-bayan-surface hover:text-bayan-teal">
              Super Admin
            </Link>
            <hr className="my-2 border-bayan-border" />
            <div className="grid gap-2">
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="button ghost w-full justify-center">
                Sign Up
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="button primary w-full justify-center">
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
