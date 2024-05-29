const catchAsyncError = require("../middlewares/catchAsyncError");
const Employee = require("../models/employeModel");
const AppError = require("../utils/AppError");

exports.createEmployee = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  console.log("hello there");
  res.status(201).json({
    status: "success",
    employee,
  });
});
exports.getAllEmploye = catchAsyncError(async (req, res, next) => {
  const employees = await Employee.find();

  res.status(200).json({
    status: "success",
    employees,
  });
});

exports.getSingleEmployee = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new AppError("Paitents does not exist", 404));
  }
  res.status(200).json({
    status: "success",
    employee,
  });
});

exports.deleteEmployee = catchAsyncError(async (req, res, next) => {
  const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

  if (!deletedEmployee) {
    return next(new AppError("Employee does found with this id", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Employee has been deleted",
    deletedEmployee,
  });
});
