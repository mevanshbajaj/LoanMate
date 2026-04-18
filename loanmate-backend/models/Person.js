const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Same phone allowed for different users, but unique per user
personSchema.index({ phone: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Person", personSchema);
