import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import "./AddPerson.css";

function AddPerson() {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/persons", form);
      toast.success("Person added successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add person");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-page">
      <div className="ap-card">
        <div className="ap-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1 className="page-title">Add New Person</h1>
          <p className="page-subtitle">Add a borrower to your ledger</p>
        </div>

        <form onSubmit={handleSubmit} className="ap-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={set("name")}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={set("phone")}
            />
          </div>

          <div className="form-group">
            <label>Address <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
            <textarea
              placeholder="Enter address"
              value={form.address}
              onChange={set("address")}
              rows={3}
            />
          </div>

          <div className="ap-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : "Save Person"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPerson;
