const express = require("express");
const {
  addPerson,
  getAllPersons,
  getPersonById,
} = require("../controllers/Personcontroller");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, addPerson);
router.get("/", authMiddleware, getAllPersons);
router.get("/:id", authMiddleware, getPersonById);

module.exports = router;
