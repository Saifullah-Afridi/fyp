const express = require("express");
const router = express.Router();
const { createPatient } = require("../controllers/patientControllers");

router.route("/").post(createPatient);

module.exports = router;
