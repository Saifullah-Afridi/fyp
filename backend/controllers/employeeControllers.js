const catchAsyncError = require("../middlewares/catchAsyncError");
const Employee = require("../models/employeeModel");
const AppError = require("../utils/AppError");

exports.create = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({
    status: "success",
    employee,
  });
});
