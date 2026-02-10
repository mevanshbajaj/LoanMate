import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPerson.css";

function AddPerson() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !phone) {
      setError("Name and phone are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-person">
      <form className="person-form" onSubmit={handleSubmit}>
        <h2 className="page-title">Add Person</h2>
        <p className="page-subtitle">
          Add a new person to manage loans
        </p>

        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address (optional)"
          />
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Add Person"}
        </button>
      </form>
    </div>
  );
}

export default AddPerson;
