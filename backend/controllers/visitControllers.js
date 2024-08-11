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
      { new: true }
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
    const visits = await Visit.find({ patient: patientId });
    if (!visits) {
      return next(new AppError("no visit Found", 404));
    }
    res.status(200).json({ status: "success", visits });
  } catch (error) {
    next(new AppError(error.message));
  }
};
