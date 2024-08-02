const express = require("express");
const router = express.Router();
const {
  createPatient,
  getMessage,
  getAllPatients,
  getSinglePatient,
  getPatientSummary,
} = require("../controllers/patientControllers");

router.route("/").get(getAllPatients).post(createPatient);
router.route("/summary").get(getPatientSummary);
router.route("/:id").get(getSinglePatient);
module.exports = router;
