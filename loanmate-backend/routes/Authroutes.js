const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/otp");
const { generateOtp } = require("../utils/otp");
const { sendEmail } = require("../utils/sendemails");

const router = express.Router();

/* =========================
   SIGNUP
========================= */

router.post("/signup", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.trim().toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await User.create({ email, password }); // NO manual hashing

    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* =========================
   LOGIN (SEND OTP)
========================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Normalize email
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      userId: user._id,
      otp: hashedOtp,
      expiresAt,
      isUsed: false
    });

    // await sendEmail(
    //   user.email,
    //   "LoanMate OTP Verification",
    //   `Your OTP is ${otp}. It expires in 5 minutes.`
    // );
    // await sendEmail(
//   user.email,
//   "LoanMate OTP Verification",
//   `Your OTP is ${otp}. It expires in 5 minutes.`
// );

console.log("OTP:", otp);

    res.json({
      message: "OTP sent successfully",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   VERIFY OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const otpRecord = await Otp.findOne({
      userId,
      isUsed: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    await Otp.deleteMany({ userId });

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;