const express = require("express");
const router = express.Router();
const { createEmployee } = require("../controllers/employeeControllers");
const { login } = require("../controllers/employeeControllers");

router.post("/", createEmployee);
router.post("/login", login);

module.exports = router;
