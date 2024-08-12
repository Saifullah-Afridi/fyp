const express = require("express");
const {
  recordVisit,
  getPatientAllVisits,
  updateVisitStatus,
} = require("../controllers/visitControllers");
const router = express.Router();

router.patch("/update-visit/:id", recordVisit);
router.get("/all-visits/:id", getPatientAllVisits);
router.patch("/update-status/:visitId", updateVisitStatus);

module.exports = router;
