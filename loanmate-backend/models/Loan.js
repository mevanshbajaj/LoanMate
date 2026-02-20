const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paidOn: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const loanSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },

    // 🔥 IMPORTANT — ADD THIS
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    durationMonths: {
      type: Number,
      required: true,
    },

    totalPayable: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    amountPending: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },

    payments: [paymentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
