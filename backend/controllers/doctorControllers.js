const catchAsyncError = require("../middlewares/catchAsyncError");
const Doctor = require("../models/doctorModel");
const AppError = require("../utils/AppError");

exports.createDoctor = catchAsyncError(async (req, res, next) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({
    status: "success",
    doctor,
  });
});
