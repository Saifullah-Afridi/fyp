const catchAsyncError = require("../middlewares/catchAsyncError");
const Patient = require("../models/patientModel");
const AppError = require("../utils/AppError");

exports.createPatient = catchAsyncError(async (req, res, next) => {
  const patient = await Patient.create(req.body);
  console.log("hello there");
  res.status(201).json({
    status: "success",
    patient,
  });
});
