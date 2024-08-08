const Employee = require("./../models/employeeModel");
const AppError = require("../utils/AppError");

const createEmployee = async (req, res, next) => {
  try {
    console.log(req.body);
    const { NIC, phoneNumber } = req.body;
    const findEmployee = await Employee.findOne({ NIC, phoneNumber });
    if (findEmployee) {
      return next(new AppError("Employee already exist With This NIC", 400));
    }
    console.log("hello from outside");
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
    res.status(200).json({
      status: "success",
      message: "You are logged in",
      employee,
      token,
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

const getSingleEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id);
    res.status(200).json({
      status: "success",
      employee,
    });

    if (!employee) {
      return next(new AppError("No employee is found", 404));
    }
  } catch (error) {
    return next(new AppError(error.message));
  }
};
const getAllEmployee = async (req, res, next) => {
  const employees = await Employee.find();
  if (!employees) {
    return next(new AppError("No is found", 404));
  }
  res.status(200).json({
    status: "success",
    employees,
  });
};

const deleteEmployee = async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Employee is deleted",
    employee,
  });
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return next(new AppError("This employee does not exist", 404));
    }
    if (!req.body.password) {
      return next(new AppError("Please Provide Password", 400));
    }
    if (req.body.password) {
      if (!req.body.confirmPassword) {
        return next(new AppError("Please Confirm Your Password", 400));
      }
      if (req.body.password !== req.body.confirmPassword) {
        return next(new AppError("Passwords Should be match"));
      }
      employee.password = req.body.password;
      employee.confirmPassword = req.body.confirmPassword;
    }

    await employee.save();
    res.status(200).json({
      status: "success",
      message: "Password has been updated",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
module.exports = {
  createEmployee,
  login,
  getAllEmployee,
  deleteEmployee,
  getSingleEmployee,
  updateEmployee,
};
