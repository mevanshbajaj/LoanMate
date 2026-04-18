import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/add-person", label: "Add Person", icon: "＋" },
];

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-emoji">💰</span>
        <span className="logo-name">LoanMate</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span>↪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
