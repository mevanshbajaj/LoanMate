import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config";
import "./AddLoan.css";

function AddLoan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || !interest) {
      setError("Loan amount and interest are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: id,
          amount,
          interest,
          note
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
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
        <p className="subtitle">
          Enter loan details for this person
        </p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Loan Amount</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Interest (%)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <textarea
              placeholder="Purpose of loan, remarks…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
