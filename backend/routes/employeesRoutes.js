const express = require("express");
const { createEmployee } = require("../controllers/employeController");
const router = express.Router();

router.route("/").post(createEmployee);

module.exports = router;
