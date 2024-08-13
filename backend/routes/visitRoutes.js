const express = require("express");
const {
  recordVisit,
  getPatientAllVisits,
  updateVisitStatus,
  getSingleVisit,
} = require("../controllers/visitControllers");
const router = express.Router();
router.get("/getSingleVisit/:id", getSingleVisit);
router.patch("/update-visit/:id", recordVisit);
router.get("/all-visits/:id", getPatientAllVisits);
router.patch("/update-status/:visitId", updateVisitStatus);

module.exports = router;
