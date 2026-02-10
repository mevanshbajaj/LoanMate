import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const styles = {
    navbar: {
      height: "64px",
      background: "#ffffff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 28px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100
    },
    logo: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#000000",
      cursor: "pointer"
    },
    actions: {
      display: "flex",
      gap: "14px"
    },
    primaryBtn: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      background: "#4a6cf7",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer"
    },
    secondaryBtn: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      background: "transparent",
      fontWeight: 600,
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.navbar}>
      <span
        style={styles.logo}
        onClick={() => navigate("/dashboard")}
      >
        LoanMate
      </span>

      <div style={styles.actions}>
        <button
          style={{
            ...styles.primaryBtn,
            background:
              location.pathname === "/add-person"
                ? "#324bdc"
                : styles.primaryBtn.background
          }}
          onClick={() => navigate("/add-person")}
        >
          Add Person
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => navigate("/")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
