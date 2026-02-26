const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* SIMPLE CORS */
app.use(cors());

app.use(express.json());

/* ROUTES */
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