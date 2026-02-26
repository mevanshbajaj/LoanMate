const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "https://loanmate-neon.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", require("./routes/Authroutes"));
app.use("/api/persons", require("./routes/Personroutes"));
app.use("/api/loans", require("./routes/Loanroutes"));

app.get("/", (req, res) => {
  res.send("LoanMate Backend is running 🚀");
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});