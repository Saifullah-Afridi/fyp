const Visit = require("../models/visitModel");
const AppError = require("../utils/AppError");

exports.recordVisit = async (req, res, next) => {
  try {
    console.log(req.body);

    const id = req.params.id;
    const { prescription, tests, medicines } = req.body;

    const visit = await Visit.findByIdAndUpdate(
      id,
      {
        prescription,
        tests,
        medicines,
        date: new Date().toISOString().split("T")[0],
      },
      { new: true, runValidators: true }
    );

    if (!visit) {
      return res
        .status(404)
        .json({ status: "fail", message: "Visit record not found" });
    }

    res.status(200).json({ status: "success", visit });
  } catch (error) {
    next(error);
  }
};

exports.getPatientAllVisits = async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const visits = await Visit.find({ patient: patientId }).populate("patient");
    if (!visits) {
      return next(new AppError("no visit Found", 404));
    }
    res.status(200).json({ status: "success", visits });
  } catch (error) {
    next(new AppError(error.message));
  }
};

exports.updateVisitStatus = async (req, res, next) => {
  const { visitId } = req.params;
  const { status } = req.body;

  if (!["incomplete", "pending", "complete"].includes(status)) {
    return next(new AppError("Invalid status", 404));
  }

  try {
    const visit = await Visit.findById(visitId);
    if (!visit) {
      return next(
        new AppError("The visit does not find with the given id", 404)
      );
    }

    visit.status = status;
    await visit.save();

    res.status(200).json({
      status: "success",
      visit,
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

exports.getSingleVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return next(new AppError("No visit is found with this id", 404));
    }
    res.status(200).json({ status: "success", visit });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
