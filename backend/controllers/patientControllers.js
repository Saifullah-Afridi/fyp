const catchAsyncError = require("../middlewares/catchAsyncError");
const moment = require("moment");
const Patient = require("../models/patientModel");
const AppError = require("../utils/AppError");
const Visit = require("../models/visitModel");

exports.registerOrUpdatePatient = async (req, res, next) => {
  try {
    const { NIC } = req.body;
    let patient = await Patient.findOne({ NIC });
    if (!patient) {
      patient = await Patient.create(req.body);
    }
    // Check if the patient has been registered today
    const today = new Date().toISOString().split("T")[0];
    const existingVisit = await Visit.findOne({
      patient: patient._id,
      date: {
        $gte: new Date(`${today}T00:00:00.000Z`),
        $lt: new Date(`${today}T23:59:59.999Z`),
      },
    });
    if (existingVisit) {
      // return res.status(200).json({
      //   status: "success",
      //   patient,
      //   message: "Patient is already registered for today.",
      // });
      return next(new AppError("Patient is already registerd for today"));
    }
    // Create visit record for today
    const visit = await Visit.create({ patient: patient._id });
    res.status(200).json({ status: "success", visit });
  } catch (error) {
    next(new AppError(error.message));
  }
};

exports.getTodaysPatients = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const visits = await Visit.find({
      date: {
        $gte: new Date(`${today}T00:00:00.000Z`),
        $lt: new Date(`${today}T23:59:59.999Z`),
      },
    }).populate("patient");

    res.status(200).json({ status: "success", visits });
  } catch (error) {
    next(error);
  }
};
exports.getAllPatients = catchAsyncError(async (req, res, next) => {
  const { nic } = req.query;
  let patients;
  if (nic) {
    patients = await Patient.find({ NIC: nic });
  }
  if (!nic) {
    patients = await Patient.find();
  }
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
exports.getPatientSummary = catchAsyncError(async (req, res, next) => {
  try {
    const today = moment().startOf("day");
    const startOfMonth = moment().startOf("month");
    const startOfYear = moment().startOf("year");
    const endOfPreviousMonth = moment().subtract(1, "month").endOf("month");

    const [
      patientsToday,
      patientsThisMonth,
      patientsLastMonth,
      patientsThisYear,
    ] = await Promise.all([
      Patient.countDocuments({ createdAt: { $gte: today.toDate() } }),
      Patient.countDocuments({ createdAt: { $gte: startOfMonth.toDate() } }),
      Patient.countDocuments({
        createdAt: { $gte: startOfYear.toDate(), $lt: startOfMonth.toDate() },
      }),
      Patient.countDocuments({ createdAt: { $gte: startOfYear.toDate() } }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        patientsToday,
        patientsThisMonth,
        patientsLastMonth,
        patientsThisYear,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});
