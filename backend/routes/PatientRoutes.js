const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getSinglePatient,
  getPatientSummary,
  registerOrUpdatePatient,
  getTodaysPatients,
} = require("../controllers/patientControllers");

router.get("/", getAllPatients);
router.post("/", registerOrUpdatePatient);
router.get("/todays-patients", getTodaysPatients);
// router.route("/").get(getAllPatients).post(createPatient);
router.route("/summary").get(getPatientSummary);
router.route("/:id").get(getSinglePatient);
module.exports = router;
