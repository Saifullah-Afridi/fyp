const express = require("express");
const { createDoctor } = require("../controllers/doctorControllers");
const router = express.Router();

router.route("/").post(createDoctor);

module.exports = router;
