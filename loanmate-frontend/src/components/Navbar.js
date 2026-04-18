import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ FIXED: JWT only contains userId, not email.
  // Show nothing — or optionally fetch user profile.
  // Removed broken jwtDecode email attempt entirely.

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <h3 className="logo">💰 LoanMate</h3>

        <div className="desktop-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/add-person" className="nav-link">Add Person</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(true)}>☰</div>
      </div>

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setMenuOpen(false)}>✕</div>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/add-person" onClick={() => setMenuOpen(false)}>Add Person</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

export default Navbar;