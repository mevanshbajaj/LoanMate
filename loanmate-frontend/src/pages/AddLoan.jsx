import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config";
import "./AddLoan.css";

function AddLoan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || !interestRate || !startDate || !endDate) {
      setError("All fields are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          personId: id,
          amount: Number(amount),
          interestRate: Number(interestRate),
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add loan");
      }

      navigate(`/person/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-loan-page">
      <div className="loan-card">
        <h2>Add Loan</h2>
        <p className="subtitle">Enter loan details for this person</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Loan Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Interest Rate % (yearly)</label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLoan;
