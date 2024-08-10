const Employee = require("./../models/employeeModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const createEmployee = async (req, res, next) => {
  try {
    console.log(req.body);
    const { NIC, phoneNumber } = req.body;
    const findEmployee = await Employee.findOne({ NIC, phoneNumber });
    if (findEmployee) {
      console.log("hello");
      return next(new AppError("Employee already exist With This NIC", 400));
    }

    const employee = await Employee.create(req.body);
    res.status(201).json({
      status: "success",
      employee,
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

const login = async (req, res, next) => {
  try {
    console.log(req.body);

    const { NIC, password } = req.body;
    if (!NIC || !password) {
      return next(new AppError("please provide NIC and Password"));
    }
    const employee = await Employee.findOne({ NIC });
    if (
      !employee ||
      !(await employee.comparePassword(password, employee.password))
    ) {
      return next(new AppError("Please provide correct NIC and Password", 400));
    }
    const token = await employee.generateJsonWebToken();
    console.log(token);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    });
    console.log(token);

    res
      .status(200)
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60,
      })
      .json({
        status: "success",
        message: "You are logged in",
        employee,
        token,
      });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

const protectedRoutes = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Please login", 400));
    }

    const payload = await jwt.verify(token, process.env.SECRET);

    const employee = await Employee.findById(payload._id);
    if (!employee) {
      return next(
        new AppError("The token belong to the employee does not exist", 400)
      );
    }
    req.token = token;
    req.employee = employee;
    next();
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const isAdmin = (req, res, next) => {
  console.log(req.employee);
  if (req.employee.occupation === "admin") {
    next();
  }
  if (req.employee.occupation !== "admin") {
    return next(
      new AppError("You are not allowed to perform such actions", 400)
    );
  }
};

const testController = async (req, res, next) => {
  res.send("you are allowed");
};
module.exports = {
  createEmployee,
  login,
  protectedRoutes,
  testController,
  isAdmin,
};
