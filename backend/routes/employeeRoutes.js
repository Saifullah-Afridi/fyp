const express = require("express");
const router = express.Router();

const {
  createEmployee,
  login,
  protectedRoutes,
  testController,
  isAdmin,
} = require("../controllers/authControllers");
const { getAllEmployee } = require("../controllers/employeeControllers");

//only admin can create new employee
//later protectedRoutes sepecific to admin
router.get("/", protectedRoutes, isAdmin, getAllEmployee);
router.post("/", createEmployee);
router.post("/login", login);
router.get("/testing", protectedRoutes, isAdmin, testController);

//only admin can update employee

module.exports = router;
