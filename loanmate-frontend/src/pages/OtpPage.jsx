import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { API } from "../config";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  const handleVerify = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid OTP");
        return;
      }

      // 🔐 SAVE TOKEN AFTER OTP VERIFIED
      localStorage.setItem("token", data.token);
      localStorage.removeItem("userId");

      navigate("/dashboard");

    } catch (err) {
      alert("Backend not reachable");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Enter OTP</h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify}>Verify OTP</button>
      </div>
    </div>
  );
}

export default OtpPage;