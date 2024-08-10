const express = require("express");
const router = express.Router();

const {
  createEmployee,
  login,
  protectedRoutes,
  testController,
  isAdmin,
} = require("../controllers/authControllers");
const {
  getAllEmployee,
  deleteEmployee,
  getSingleEmployee,
  updateEmployee,
} = require("../controllers/employeeControllers");

//only admin can create new employee
//later protectedRoutes sepecific to admin
router.get("/", protectedRoutes, isAdmin, getAllEmployee);
router.post("/login", login);
router.post("/", createEmployee);
router.get("/:id", protectedRoutes, isAdmin, getSingleEmployee);
router.delete("/:id", protectedRoutes, isAdmin, deleteEmployee);
router.patch("/:id", protectedRoutes, isAdmin, updateEmployee);
router.get("/testing", protectedRoutes, isAdmin, testController);

//only admin can update employee

module.exports = router;
