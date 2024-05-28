const express = require("express");
const router = express.Router();
const {
  createPatient,
  getMessage,
} = require("../controllers/patientControllers");

router.post("/", createPatient);
router.get("/", getMessage);

module.exports = router;
