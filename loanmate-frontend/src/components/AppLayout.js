import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {mobileOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
          <div className="sidebar-mobile">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <main className="main-content">
        <div className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setMobileOpen(true)}>☰</button>
          <span className="mobile-brand">💰 LoanMate</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
