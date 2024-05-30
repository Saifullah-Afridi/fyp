const catchAsyncError = require("../middlewares/catchAsyncError");
const Patient = require("../models/patientModel");
const AppError = require("../utils/AppError");

exports.createPatient = catchAsyncError(async (req, res, next) => {
  const patient = await Patient.create(req.body);
  res.status(201).json({
    status: "success",
    patient,
  });
});

exports.getAllPatients = catchAsyncError(async (req, res, next) => {
  const patients = await Patient.find();
  if (!patients) {
    return next(new AppError("Patients does not exist", 404));
  }
  res.status(200).json({
    status: "success",
    patients,
  });
});

exports.getSinglePatient = catchAsyncError(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return next(new AppError("Paitents does not exist with this id", 404));
  }
  res.status(200).json({
    status: "success",
    patient,
  });
});
