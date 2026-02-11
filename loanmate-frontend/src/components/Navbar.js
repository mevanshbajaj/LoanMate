import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
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
    <div className="navbar">
      <div className="nav-left">
        <h3 className="logo">LoanMate</h3>

        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>

        <Link to="/add-person" className="nav-link">
          Add Person
        </Link>
      </div>

      <div className="nav-right">
        {userEmail && <span className="email">{userEmail}</span>}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
