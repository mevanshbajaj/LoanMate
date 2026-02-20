const Person = require("../models/Person");

// POST /api/persons
const addPerson = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    // 🔥 Check only within this user
    const existingPerson = await Person.findOne({
      phone,
      userId: req.userId,
    });

    if (existingPerson) {
      return res.status(400).json({
        message: "Person with this phone already exists",
      });
    }

    const person = await Person.create({
      name,
      phone,
      address,
      userId: req.userId, // 🔥 Important
    });

    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/persons
const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find({
      userId: req.userId, // 🔥 Only logged-in user
    }).sort({ createdAt: -1 });

    res.json(persons);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/persons/:id
const getPersonById = async (req, res) => {
  try {
    const person = await Person.findOne({
      _id: req.params.id,
      userId: req.userId, // 🔥 Protect access
    });

    if (!person) {
      return res.status(404).json({
        message: "Person not found",
      });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addPerson,
  getAllPersons,
  getPersonById,
};
