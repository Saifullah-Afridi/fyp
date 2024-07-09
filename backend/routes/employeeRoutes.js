const express = require("express");
const router = express.Router();
const { createEmployee } = require("../controllers/employeeControllers");
const { login } = require("../controllers/employeeControllers");
const {
  protectedRoutes,
  testController,
  isAdmin,
} = require("../controllers/authControllers");

//only admin can create new employee
//later protectedRoutes sepecific to admin
router.post("/", createEmployee);
router.post("/login", login);
router.get("/testing", protectedRoutes, isAdmin, testController);

//only admin can update employee

module.exports = router;
