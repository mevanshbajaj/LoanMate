const express = require("express");
const mongoose = require("mongoose");
const Loan = require("../models/Loan");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/* CREATE LOAN */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { personId, amount, interestRate, startDate, endDate } = req.body;

    if (!personId || !amount || !interestRate || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const principal = Number(amount);
    const rate = Number(interestRate);

    if (principal <= 0 || rate <= 0) {
      return res.status(400).json({ message: "Invalid amount or interest rate" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (durationMonths <= 0) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const totalInterest = (principal * rate * durationMonths) / (12 * 100);
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

/* GET LOANS BY PERSON */
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

/* PAY LOAN */
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

    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (loan.status === "CLOSED") return res.status(400).json({ message: "Loan already closed" });

    if (payAmount > loan.amountPending) {
      return res.status(400).json({
        message: `Payment ₹${payAmount} exceeds pending amount ₹${loan.amountPending}`,
      });
    }

    loan.amountPaid += payAmount;
    loan.amountPending -= payAmount;
    loan.payments.push({ amount: payAmount, paidOn: new Date() });

    if (loan.amountPending === 0) loan.status = "CLOSED";

    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error("Pay loan error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* DASHBOARD SUMMARY */
router.get("/summary/all", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.userId });

    const totalGiven = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalPaid = loans.reduce((sum, l) => sum + l.amountPaid, 0);
    const totalPending = loans.reduce((sum, l) => sum + l.amountPending, 0);
    const activeLoans = loans.filter((l) => l.status === "ACTIVE").length;

    res.json({ totalGiven, totalPaid, totalPending, activeLoans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* MONTHLY STATS — last 6 months for chart */
router.get("/monthly-stats", authMiddleware, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const stats = await Loan.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          given: { $sum: "$amount" },
          paid: { $sum: "$amountPaid" },
          pending: { $sum: "$amountPending" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = stats.map((s) => ({
      month: new Date(s._id + "-01").toLocaleString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      given: s.given,
      paid: s.paid,
      pending: s.pending,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
