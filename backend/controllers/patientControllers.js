const catchAsyncError = require("../middlewares/catchAsyncError");
const Patient = require("../models/patientModel");
const AppError = require("../utils/AppError");

exports.createPatient = catchAsyncError(async (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body
  const patient = await Patient.create(req.body);
  console.log("Patient Created:", patient); // Log the created patient
  res.status(201).json({
    status: "success",
    patient,
  });
});
exports.getMessage = catchAsyncError(async (req, res, next) => {
  res.send("hello you got the messsage");
});
