const express = require("express");
const {
  recordVisit,
  getPatientAllVisits,
} = require("../controllers/visitControllers");
const router = express.Router();

router.patch("/update-visit/:id", recordVisit);
router.get("/all-visits/:id", getPatientAllVisits);

module.exports = router;
