const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://loanmate-neon.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/Authroutes"));
app.use("/api/persons", require("./routes/Personroutes"));
app.use("/api/loans", require("./routes/Loanroutes"));

app.get("/", (req, res) => {
  res.send("LoanMate Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});