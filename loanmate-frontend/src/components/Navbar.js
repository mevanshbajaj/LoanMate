import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  let userEmail = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userEmail = decoded.email;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <h3 className="logo">LoanMate</h3>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          <Link to="/add-person" className="nav-link">
            Add Person
          </Link>

          {userEmail && <span className="email">{userEmail}</span>}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Hamburger */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setMenuOpen(false)}>
          ✕
        </div>

        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          Dashboard
        </Link>

        <Link to="/add-person" onClick={() => setMenuOpen(false)}>
          Add Person
        </Link>

        {userEmail && <span className="email">{userEmail}</span>}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
