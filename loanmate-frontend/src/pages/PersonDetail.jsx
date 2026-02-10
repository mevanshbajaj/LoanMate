import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PersonDetail.css";

function PersonDetail() {
  const { id } = useParams();

  // Add loan form states
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Loans list
  const [loans, setLoans] = useState([]);

  // Pay amount states
  const [payAmount, setPayAmount] = useState("");
  const [payingLoanId, setPayingLoanId] = useState(null);

  // =========================
  // FORMAT DATE FUNCTION
  // =========================
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FETCH LOANS ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetch(`http://localhost:5000/api/loans/person/${id}`)
      .then((res) => res.json())
      .then((data) => setLoans(data))
      .catch((err) => console.error(err));
  }, [id]);

  // =========================
  // ADD LOAN
  // =========================
  const addLoan = async () => {
    if (!amount || !interest || !startDate || !endDate) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId: id,
        amount: Number(amount),
        interestRate: Number(interest),
        startDate,
        endDate,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error adding loan");
      return;
    }

    setLoans([data, ...loans]);

    setAmount("");
    setInterest("");
    setStartDate("");
    setEndDate("");
  };

  // =========================
  // PAY LOAN AMOUNT
  // =========================
  const payLoanAmount = async (loanId) => {
    if (!payAmount) {
      alert("Enter amount to pay");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/loans/${loanId}/pay`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(payAmount) }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Payment failed");
      return;
    }

    setLoans(loans.map((l) => (l._id === data._id ? data : l)));
    setPayAmount("");
    setPayingLoanId(null);
  };

  // =========================
  // TOTAL SUMMARY
  // =========================
  const totalGiven = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalPaid = loans.reduce((sum, l) => sum + l.amountPaid, 0);
  const totalPending = loans.reduce((sum, l) => sum + l.amountPending, 0);

  return (
    <div className="person-detail">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <h1>Person Loan Profile</h1>
          <p className="sub-text">
            Loan applied date, paid & pending overview
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="card info-grid">
        <div>
          <strong>Total Given</strong>
          <p>₹ {totalGiven}</p>
        </div>
        <div>
          <strong>Total Paid</strong>
          <p>₹ {totalPaid}</p>
        </div>
        <div>
          <strong>Total Pending</strong>
          <p>₹ {totalPending}</p>
        </div>
      </div>

      {/* ADD LOAN */}
      <div className="card loan-form">
        <label>Loan Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Interest % (yearly)</label>
        <input
          type="number"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button className="add-loan-btn" onClick={addLoan}>
          Add Loan
        </button>
      </div>

      {/* LOANS LIST */}
      <div className="card loan-list">
        <h3>Loans</h3>

        {loans.length === 0 ? (
          <p className="loan-note">No loans added yet</p>
        ) : (
          loans.map((loan) => (
            <div key={loan._id} className="loan-item">
              <div>
                <strong>₹ {loan.amount}</strong>

                {/* ✅ LOAN APPLIED DATE */}
                <div className="loan-note">
                  Applied on: {formatDate(loan.appliedDate)}
                </div>

                <div className="loan-note">
                  Total: ₹ {loan.totalPayable}
                </div>
                <div className="loan-note">
                  Paid: ₹ {loan.amountPaid}
                </div>
                <div className="loan-note">
                  Pending: ₹ {loan.amountPending}
                </div>
                {loan.payments && loan.payments.length > 0 && (
  <div className="loan-note" style={{ marginTop: "6px" }}>
    <strong>Payments:</strong>
    {loan.payments.map((p, index) => (
      <div key={index}>
        ₹ {p.amount} on{" "}
        {new Date(p.paidOn).toLocaleDateString("en-IN")}
      </div>
    ))}
  </div>
)}

              </div>

              <div>
                <div className="loan-interest">
                  {loan.status}
                </div>

                {loan.status === "ACTIVE" && (
                  <div style={{ marginTop: "8px" }}>
                    {payingLoanId === loan._id ? (
                      <>
                        <input
                          type="number"
                          placeholder="Pay amount"
                          value={payAmount}
                          onChange={(e) =>
                            setPayAmount(e.target.value)
                          }
                          style={{
                            width: "120px",
                            padding: "6px",
                            marginBottom: "6px",
                          }}
                        />
                        <button
                          onClick={() =>
                            payLoanAmount(loan._id)
                          }
                          style={{
                            width: "100%",
                            padding: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Pay
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setPayingLoanId(loan._id)
                        }
                        style={{
                          marginTop: "6px",
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Pay Amount
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PersonDetail;
