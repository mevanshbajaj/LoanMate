const Loan = require("../models/Loan");

// ===============================
// ADD LOAN
// POST /api/loans
// ===============================
const addLoan = async (req, res) => {
  try {
    const {
      personId,
      amount,
      interestRate,
      startDate,
      endDate,
    } = req.body;

    if (!personId || !amount || !interestRate || !startDate || !endDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const principal = Number(amount);
    const rate = Number(interestRate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (durationMonths <= 0) {
      return res.status(400).json({
        message: "Invalid loan duration",
      });
    }

    // SIMPLE INTEREST
    const totalInterest =
      (principal * rate * durationMonths) / (12 * 100);

    const totalPayable = Math.round(principal + totalInterest);

    const loan = await Loan.create({
      personId,
      userId: req.userId, // 🔥 USER ISOLATION
      amount: principal,
      interestRate: rate,
      startDate,
      endDate,
      durationMonths,
      totalPayable,
      amountPaid: 0,
      amountPending: totalPayable,
      status: "ACTIVE",
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET LOANS BY PERSON
// GET /api/loans/person/:personId
// ===============================
const getLoansByPerson = async (req, res) => {
  try {
    const loans = await Loan.find({
      personId: req.params.personId,
      userId: req.userId, // 🔥 ONLY THIS USER
    }).sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// PAY LOAN
// PUT /api/loans/:loanId/pay
// ===============================
const payLoanAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid payment amount required",
      });
    }

    const loan = await Loan.findOne({
      _id: req.params.loanId,
      userId: req.userId, // 🔥 PROTECT ACCESS
    });

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    if (loan.status === "CLOSED") {
      return res.status(400).json({
        message: "Loan already closed",
      });
    }

    const payAmount = Number(amount);

    loan.amountPaid += payAmount;
    loan.amountPending = loan.totalPayable - loan.amountPaid;

    // Add payment history
    loan.payments.push({
      amount: payAmount,
    });

    // Auto close if fully paid
    if (loan.amountPending <= 0) {
      loan.amountPending = 0;
      loan.status = "CLOSED";
    }

    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLoan,
  getLoansByPerson,
  payLoanAmount,
};
