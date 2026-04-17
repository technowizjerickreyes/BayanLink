import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar.jsx";
import PublicFooter from "./PublicFooter.jsx";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bayan-surface">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
