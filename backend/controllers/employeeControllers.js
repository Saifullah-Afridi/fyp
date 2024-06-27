const Employee = require("./../models/employeeModel");
const jwt = require("jsonwebtoken");
const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({
      status: "success",
      employee,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", messge: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log("inside login fucntion");
    const { NIC, password } = req.body;
    if (!NIC || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please provide NIC and passowrd" });
    }
    const employee = await Employee.findOne({ NIC });
    if (
      !employee ||
      !(await employee.comparePassword(password, employee.password))
    ) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please correct Creditentials" });
    }
    res.status(200).json({ status: "success", message: "You are logged in" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = { createEmployee, login };
