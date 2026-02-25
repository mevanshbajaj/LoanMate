import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // 🔐 SAVE userId TEMPORARILY
      localStorage.setItem("userId", data.userId);

      // ✅ Redirect to OTP page
      navigate("/verify-otp");

    } catch (err) {
      alert("Backend not reachable");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p style={{ marginTop: "12px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#4a6cf7" }}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;