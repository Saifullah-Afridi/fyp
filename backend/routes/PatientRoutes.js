const express = require("express");
const router = express.Router();
const {
  createPatient,
  getMessage,
  getAllPatients,
} = require("../controllers/patientControllers");

router.route("/").get(getAllPatients).post(createPatient);

module.exports = router;
