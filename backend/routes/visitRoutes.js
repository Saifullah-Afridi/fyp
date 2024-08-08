const express = require("express");
const { recordVisit } = require("../controllers/visitControllers");
const router = express.Router();

router.post("/record", recordVisit);

module.exports = router;
