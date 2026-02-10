const Loan = require("../models/Loan");

// POST /api/loans
const addLoan = async (req, res) => {
  try {
    const { personId, amount, interest, note } = req.body;

    if (!personId || !amount || !interest) {
      return res.status(400).json({
        message: "Person, amount and interest are required"
      });
    }

    const loan = await Loan.create({
      person: personId,
      amount,
      interest,
      note
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/loans/:personId
const getLoansByPerson = async (req, res) => {
  try {
    const loans = await Loan.find({ person: req.params.personId })
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLoan,
  getLoansByPerson
};
