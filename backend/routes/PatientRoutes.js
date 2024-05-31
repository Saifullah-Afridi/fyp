const express = require("express");
const router = express.Router();
const {
  createPatient,
  getMessage,
  getAllPatients,
  getSinglePatient,
} = require("../controllers/patientControllers");

router.route("/").get(getAllPatients).post(createPatient);
router.route("/:id").get(getSinglePatient);

module.exports = router;
