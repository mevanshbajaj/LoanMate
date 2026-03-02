import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../config";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
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

      // ✅ Save JWT token safely
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert("Token not received from server");
      }

    } catch (error) {
      console.error("Login error:", error);
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

      <p className="copyright">
        © {new Date().getFullYear()} Vansh Bajaj. All rights reserved.
      </p>
    </div>
  );
}

export default Login;