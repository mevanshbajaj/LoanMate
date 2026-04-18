import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import "./PersonDetail.css";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [payingLoanId, setPayingLoanId] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const [form, setForm] = useState({
    amount: "",
    interestRate: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personRes, loansRes] = await Promise.all([
          api.get(`/persons/${id}`),
          api.get(`/loans/person/${id}`),
        ]);
        setPerson(personRes.data);
        setLoans(loansRes.data);
      } catch {
        toast.error("Failed to load person details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addLoan = async () => {
    const { amount, interestRate, startDate, endDate } = form;
    if (!amount || !interestRate || !startDate || !endDate) {
      toast.error("All fields are required");
      return;
    }

    const tid = toast.loading("Adding loan...");
    try {
      const res = await api.post("/loans", {
        personId: id,
        amount: Number(amount),
        interestRate: Number(interestRate),
        startDate,
        endDate,
      });
      setLoans([res.data, ...loans]);
      setForm({ amount: "", interestRate: "", startDate: "", endDate: "" });
      setShowAddForm(false);
      toast.success("Loan added", { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add loan", { id: tid });
    }
  };

  const payLoan = async (loanId) => {
    if (!payAmount || Number(payAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const tid = toast.loading("Processing payment...");
    try {
      const res = await api.put(`/loans/${loanId}/pay`, { amount: Number(payAmount) });
      setLoans(loans.map((l) => (l._id === res.data._id ? res.data : l)));
      setPayAmount("");
      setPayingLoanId(null);
      toast.success("Payment recorded", { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed", { id: tid });
    }
  };

  if (loading) {
    return (
      <div className="person-detail">
        <div className="skeleton" style={{ height: 88, borderRadius: 12, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 12 }} />
      </div>
    );
  }

  const totalGiven = loans.reduce((s, l) => s + l.amount, 0);
  const totalPaid = loans.reduce((s, l) => s + l.amountPaid, 0);
  const totalPending = loans.reduce((s, l) => s + l.amountPending, 0);
  const activeCount = loans.filter((l) => l.status === "ACTIVE").length;

  return (
    <div className="person-detail">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      {/* Person card */}
      <div className="pd-person-card">
        <div className="pd-avatar">{person?.name?.charAt(0).toUpperCase()}</div>
        <div className="pd-info">
          <h1 className="pd-name">{person?.name}</h1>
          <p className="pd-phone">{person?.phone}</p>
          {person?.address && <p className="pd-address">{person.address}</p>}
        </div>
        <div className="pd-badge-wrap">
          <span className="pd-badge">{activeCount} active</span>
        </div>
      </div>

      {/* Summary bar */}
      <div className="pd-summary">
        <div className="pd-stat">
          <span className="pd-stat-label">Total Given</span>
          <span className="pd-stat-val blue">{fmt(totalGiven)}</span>
        </div>
        <div className="pd-divider" />
        <div className="pd-stat">
          <span className="pd-stat-label">Paid</span>
          <span className="pd-stat-val green">{fmt(totalPaid)}</span>
        </div>
        <div className="pd-divider" />
        <div className="pd-stat">
          <span className="pd-stat-label">Pending</span>
          <span className="pd-stat-val red">{fmt(totalPending)}</span>
        </div>
      </div>

      {/* Loans section */}
      <div className="pd-loans-card">
        <div className="pd-loans-header">
          <p className="section-title">Loans ({loans.length})</p>
          <button
            className={showAddForm ? "btn-secondary" : "btn-primary"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Add Loan"}
          </button>
        </div>

        {/* Add loan form */}
        {showAddForm && (
          <div className="add-loan-panel">
            <div className="form-row-2">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Interest % (yearly)</label>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  value={form.interestRate}
                  onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" onClick={addLoan}>
                Add Loan
              </button>
            </div>
          </div>
        )}

        {/* Loan cards */}
        {loans.length === 0 ? (
          <div className="empty-state" style={{ padding: "32px 0" }}>
            <p className="empty-icon">📄</p>
            <p>No loans yet. Add one above.</p>
          </div>
        ) : (
          <div className="loan-list">
            {loans.map((loan) => {
              const paidPct = Math.round((loan.amountPaid / loan.totalPayable) * 100);

              return (
                <div
                  key={loan._id}
                  className={`loan-card${loan.status === "CLOSED" ? " loan-closed" : ""}`}
                >
                  {/* Top row */}
                  <div className="loan-top">
                    <div>
                      <p className="loan-amount">{fmt(loan.amount)}</p>
                      <p className="loan-meta">
                        {loan.interestRate}% p.a. · {loan.durationMonths} months
                      </p>
                      <p className="loan-meta">
                        {formatDate(loan.startDate)} → {formatDate(loan.endDate)}
                      </p>
                    </div>
                    <div className="loan-right">
                      <span className={`loan-badge ${loan.status === "ACTIVE" ? "badge-active" : "badge-closed"}`}>
                        {loan.status}
                      </span>
                      <p className="loan-total">Total: {fmt(loan.totalPayable)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${paidPct}%` }} />
                  </div>
                  <div className="progress-labels">
                    <span className="lbl-paid">Paid: {fmt(loan.amountPaid)} ({paidPct}%)</span>
                    <span className="lbl-pending">Pending: {fmt(loan.amountPending)}</span>
                  </div>

                  {/* Payment history */}
                  {loan.payments?.length > 0 && (
                    <div className="pay-history">
                      <p className="pay-history-title">Payment History</p>
                      {loan.payments.map((p, i) => (
                        <div key={i} className="pay-row">
                          <span className="pay-dot" />
                          <span className="pay-amt">{fmt(p.amount)}</span>
                          <span className="pay-date">{formatDate(p.paidOn)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pay action */}
                  {loan.status === "ACTIVE" && (
                    <div className="pay-action">
                      {payingLoanId === loan._id ? (
                        <div className="pay-form-inline">
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                          />
                          <button className="btn-primary" onClick={() => payLoan(loan._id)}>
                            Pay
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => { setPayingLoanId(null); setPayAmount(""); }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn-record-pay"
                          onClick={() => setPayingLoanId(loan._id)}
                        >
                          + Record Payment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonDetail;
