import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar onClose={() => setMenuOpen(false)} open={menuOpen} />
      <div className="main-shell">
        <Navbar onMenuToggle={() => setMenuOpen(true)} />
        <main className="content-shell">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
