const express = require("express");
const {
  addPerson,
  getAllPersons,
  getPersonById
} = require("../controllers/Personcontroller");

const router = express.Router();

router.post("/", addPerson);
router.get("/", getAllPersons);
router.get("/:id", getPersonById);

module.exports = router;
