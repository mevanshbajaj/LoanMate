const express = require("express");
const Loan = require("../models/Loan");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/* =====================================
   CREATE LOAN
===================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { personId, amount, interestRate, startDate, endDate } = req.body;

    if (!personId || !amount || !interestRate || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const principal = Number(amount);
    const rate = Number(interestRate);

    if (principal <= 0 || rate <= 0) {
      return res.status(400).json({ message: "Invalid amount or interest" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (durationMonths <= 0) {
      return res.status(400).json({ message: "Invalid loan duration" });
    }

    // SIMPLE INTEREST
    const totalInterest =
      (principal * rate * durationMonths) / (12 * 100);

    const totalPayable = Math.round(principal + totalInterest);

    const loan = await Loan.create({
      personId,
      userId: req.userId,
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
  } catch (err) {
    console.error("Loan create error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================
   GET LOANS FOR A PERSON
===================================== */
router.get("/person/:personId", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({
      personId: req.params.personId,
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================
   PAY AMOUNT (FIXED OVERPAY ISSUE)
===================================== */
router.put("/:loanId/pay", authMiddleware, async (req, res) => {
  try {
    const payAmount = Number(req.body.amount);

    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const loan = await Loan.findOne({
      _id: req.params.loanId,
      userId: req.userId,
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status === "CLOSED") {
      return res.status(400).json({ message: "Loan already closed" });
    }

    // 🔥 PREVENT OVERPAYMENT
    if (payAmount > loan.amountPending) {
      return res.status(400).json({
        message: `Payment exceeds pending amount (₹${loan.amountPending})`,
      });
    }

    // Safe update
    loan.amountPaid += payAmount;
    loan.amountPending -= payAmount;

    // Store payment history
    loan.payments.push({
      amount: payAmount,
      paidOn: new Date(),
    });

    // Auto close when fully paid
    if (loan.amountPending === 0) {
      loan.status = "CLOSED";
    }

    await loan.save();

    res.json(loan);
  } catch (err) {
    console.error("Pay loan error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================
   FIX PENDING (OPTIONAL)
===================================== */
router.put("/fix-pending", async (req, res) => {
  try {
    const loans = await Loan.find({ amountPending: { $exists: false } });

    for (let loan of loans) {
      loan.amountPaid = loan.amountPaid || 0;
      loan.amountPending = loan.totalPayable - loan.amountPaid;

      if (loan.amountPending <= 0) {
        loan.amountPending = 0;
        loan.status = "CLOSED";
      }

      await loan.save();
    }

    res.json({ message: "Loans fixed", count: loans.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================
   DASHBOARD SUMMARY
===================================== */
router.get("/summary/all", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.userId });

    const totalGiven = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalPaid = loans.reduce((sum, l) => sum + l.amountPaid, 0);
    const totalPending = loans.reduce((sum, l) => sum + l.amountPending, 0);
    const activeLoans = loans.filter(
      (l) => l.status === "ACTIVE"
    ).length;

    res.json({
      totalGiven,
      totalPaid,
      totalPending,
      activeLoans,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;""